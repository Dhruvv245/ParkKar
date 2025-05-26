import cv2
import pickle
import numpy as np
import requests
import sys
import os
import argparse
import time

# Argument parser for --stream flag
parser = argparse.ArgumentParser()
parser.add_argument('--stream', action='store_true', help='Enable MJPEG streaming to stdout')
args = parser.parse_args()

# Video feed and position file paths
base_dir = os.path.dirname(__file__)
video_path = os.path.join(base_dir, 'cbb.mp4')
cbposn_path = os.path.join(base_dir, 'cbposn')

cap = cv2.VideoCapture(video_path)
with open(cbposn_path, 'rb') as f:
    posList = pickle.load(f)

prev_parking_status = [False] * len(posList)
width, height = 250, 500

def checkParkingSpace(imgPro):
    global prev_parking_status
    parking_status = []
    spaceCounter = 0

    for pos in posList:
        x, y = pos
        imgCrop = imgPro[y:y + height, x:x + width]
        count = cv2.countNonZero(imgCrop)

        if count < 1500:
            spaceCounter += 1
            occupied = False
        else:
            occupied = True

        parking_status.append(occupied)

    # Check for changes in parking space statuses
    if parking_status != prev_parking_status:
        prev_parking_status = parking_status
        try:
            headers = {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOGExZDViMDE5MGIyMTQzNjBkYzA1NyIsImlhdCI6MTcyNzI4ODQ1MSwiZXhwIjoxODA1MDQ4NDUxfQ.dc8d2XoTjXIbZnkD2zNDGVso1um9XR4_noLYdskPqb4"
            }
            data = {
                "freeSlots": spaceCounter
            }
            response = requests.patch(
                'http://127.0.0.1:3000/api/v1/parkings/5c88fa8cf4afda39709c2974',
                headers=headers, json=data
            )
            print(spaceCounter)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print('Failed', e)
            raise e
fps = cap.get(cv2.CAP_PROP_FPS)
if fps <= 0:
    fps = 25 
while True:
    start_time = time.time()
    success, img = cap.read()
    if not success:
        break

    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(imgGray, (3, 3), 1)
    imgThreshold = cv2.adaptiveThreshold(
        imgBlur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV, 25, 16
    )
    imgMedian = cv2.medianBlur(imgThreshold, 5)
    kernel = np.ones((3, 3), np.uint8)
    imgDilate = cv2.dilate(imgMedian, kernel, iterations=1)

    checkParkingSpace(imgDilate)

    if args.stream:
        # Encode frame as JPEG
        ret, jpeg = cv2.imencode('.jpg', img)
        if not ret:
            continue

        # Write MJPEG frame to stdout
        sys.stdout.buffer.write(b'--frame\r\n')
        sys.stdout.buffer.write(b'Content-Type: image/jpeg\r\n\r\n')
        sys.stdout.buffer.write(jpeg.tobytes())
        sys.stdout.buffer.write(b'\r\n')
        sys.stdout.flush()
    else:
        # No video streaming or GUI in headless mode
        pass
    elapsed = time.time() - start_time
    delay = max(0.005, 1.0 / fps - elapsed, 0)
    time.sleep(delay)