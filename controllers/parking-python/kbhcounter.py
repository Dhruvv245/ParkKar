import cv2
import pickle
import cvzone
import numpy as np
import requests

# Video feed
cap = cv2.VideoCapture('D:/Parking Solns/controllers/parking-python/kbh.mp4')

with open(r'D:\Parking Solns\controllers\parking-python\kbhposn', 'rb') as f:
    posList = pickle.load(f)

prev_parking_status = [False] * len(posList)

width, height = 200,200
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
        # cv2.imshow(str(x * y), imgCrop)
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
        # cv2.rectangle(img_r, pos, (pos[0] + width, pos[1] + height), color, thickness)
        # cvzone.putTextRect(img_r, str(count), (x, y + height - 3), scale=1,
        #     thickness=2, offset=0, colorR=color)

        # cvzone.putTextRect(img_r, f'Free: {spaceCounter}/{len(posList)}', (100, 50), scale=3,
        #                    thickness=5, offset=20, colorR=(0,200,0))

        parking_status.append(occupied)

    # Check for changes in parking space statuses
    if parking_status != prev_parking_status:
        # Update the previous parking status
        prev_parking_status = parking_status    
        try:
            headers = {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOGExZDViMDE5MGIyMTQzNjBkYzA1NyIsImlhdCI6MTcyNzI4ODQ1MSwiZXhwIjoxODA1MDQ4NDUxfQ.dc8d2XoTjXIbZnkD2zNDGVso1um9XR4_noLYdskPqb4"
            }
            data = {
                "freeSlots" : spaceCounter
            }
            response = requests.patch('http://127.0.0.1:3000/api/v1/parkings/66166ae48406964c3e58c871', headers=headers,json=data)
            print(spaceCounter)
            response.raise_for_status()  # Raise an exception if the request was unsuccessful
        except requests.exceptions.RequestException as e:
            print('Failed', e)
            raise e

    
while True:

    # if cap.get(cv2.CAP_PROP_POS_FRAMES) == cap.get(cv2.CAP_PROP_FRAME_COUNT):
    #     cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    success, img = cap.read()
    img_r=rescaleframe(img)
    imgGray = cv2.cvtColor(img_r, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(imgGray, (3, 3), 1)
    imgThreshold = cv2.adaptiveThreshold(imgBlur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                         cv2.THRESH_BINARY_INV, 25, 16)
    imgMedian = cv2.medianBlur(imgThreshold, 5)
    kernel = np.ones((3, 3), np.uint8)
    imgDilate = cv2.dilate(imgMedian, kernel, iterations=1)

    checkParkingSpace(imgDilate)
    cv2.imshow("Image", img_r)
    # cv2.imshow("ImageBlur", imgBlur)
    # cv2.imshow("ImageThres", imgMedian)
    cv2.waitKey(10)