import cv2
import pickle
import cvzone
import numpy as np
import requests
import sys
import os
import argparse

# Argument parser for --stream flag
parser = argparse.ArgumentParser()
parser.add_argument('--stream', action='store_true', help='Enable MJPEG streaming to stdout')
args = parser.parse_args()

# Video feed
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
video_path = os.path.join(BASE_DIR, 'kbh.mp4')
positions_path = os.path.join(BASE_DIR, 'kbhposn')

cap = cv2.VideoCapture(video_path)

with open(positions_path, 'rb') as f:
    posList = pickle.load(f)

prev_parking_status = [False] * len(posList)

width, height = 200, 200
def rescaleframe(frame, scale=0.5):
    width = int(frame.shape[1] * scale)
    height = int(frame.shape[0] * scale)
    dimensions = (width, height)
    return cv2.resize(frame, dimensions, interpolation=cv2.INTER_AREA)

def checkParkingSpace(imgPro):
    global prev_parking_status
    parking_status = []
    spaceCounter = 0

    for pos in posList:
        x, y = pos

        imgCrop = imgPro[y:y + height, x:x + width]
        count = cv2.countNonZero(imgCrop)

        if count < 4500:
            color = (0, 255, 0)
            thickness = 5
            spaceCounter += 1
            occupied = False # parking space is free
        else:
            color = (0, 0, 255)
            thickness = 2
            occupied = True # parking space is occupied
        # Optionally draw rectangles or overlays here if needed

        parking_status.append(occupied)

    # Check for changes in parking space statuses
    if parking_status != prev_parking_status:
        prev_parking_status = parking_status    
        try:
            headers = {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOGExZDViMDE5MGIyMTQzNjBkYzA1NyIsImlhdCI6MTcyNzI4ODQ1MSwiZXhwIjoxODA1MDQ4NDUxfQ.dc8d2XoTjXIbZnkD2zNDGVso1um9XR4_noLYdskPqb4"
            }
            data = {
                "freeSlots" : spaceCounter
            }
            response = requests.patch('http://127.0.0.1:3000/api/v1/parkings/66166ae48406964c3e58c871', headers=headers, json=data)
            print(spaceCounter)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print('Failed', e)
            raise e

while True:
    success, img = cap.read()
    if not success:
        break

    img_r = rescaleframe(img)
    imgGray = cv2.cvtColor(img_r, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(imgGray, (3, 3), 1)
    imgThreshold = cv2.adaptiveThreshold(imgBlur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                         cv2.THRESH_BINARY_INV, 25, 16)
    imgMedian = cv2.medianBlur(imgThreshold, 5)
    kernel = np.ones((3, 3), np.uint8)
    imgDilate = cv2.dilate(imgMedian, kernel, iterations=1)

    checkParkingSpace(imgDilate)

    if args.stream:
        # Encode frame as JPEG
        ret, jpeg = cv2.imencode('.jpg', img_r)
        if not ret:
            continue

        # Write MJPEG frame to stdout
        sys.stdout.buffer.write(b'--frame\r\n')
        sys.stdout.buffer.write(b'Content-Type: image/jpeg\r\n\r\n')
        sys.stdout.buffer.write(jpeg.tobytes())
        sys.stdout.buffer.write(b'\r\n')
        sys.stdout.flush()
    else:
        pass
        # Only slot count updates, no video streaming
        # cv2.imshow("Image", img_r)
        # cv2.waitKey(10)