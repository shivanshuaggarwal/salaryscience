from flask import Flask, render_template, send_from_directory
import json
from flask import request
import numpy as np
import pandas as pd
import pickle
from sklearn.neighbors import KNeighborsRegressor



app = Flask(__name__)
years=[i for i in range(0,16)]
months=[i for i in range(0,12)]
skills=["Hybris","Salesforce","Frontend","Java","QA"]


def city (loc):
    t2=['SRINAGAR','DEHRADUN','JABALPUR','RANCHI','JALANDHAR','FARIDABAD','CHANDIGARH','ALLAHABAD','JAIPUR','LUCKNOW','RANCHI','AHMEDABAD','VARANASI','GHAZIABAD','MADURAI','COIMBATORE','PUNE','INDORE','AURANGABAD','UDAIPUR','KOCHI','VADODARA','MANGALORE','SALEM','PONDICHERRY','VISHAKHAPATNAM','VISAKHAPATNAM','MYSORE','PATNA','VIJAYAWADA','ASSAM','JAMSHEDPUR','BHUBANESHWAR','NAGPUR','VISAKHAPATNAM', 'SURAT']
    t3=['MOHALI','PANIPAT','RATNAGIRI','VERNA','GANDHIDHAM','NASIK','VAPI','ANAND','NANDYAL','BHILLAI','MUMBAI SUBURBS', 'ERNAKULAM','COCHIN','TRIVANDRUM','TRICHY','TIRUCHENGODE','KADAPA/CUDDAPAH','KADAPA/CUDDAPAH','TIRUPATI','GANNAVARAM','GANDHINAGAR']
    t1= ['GURUGRAM','DELHI','NOIDA','GURGAON','DELHI-NCR','GREATER NOIDA', 'BANGALORE','BENGALURU','CHENNAI','HYDERABAD','HYDERABADSECUNDERABAD','KOLKATA','NAVI MUMBAI','KALYAN NAGAR','KALYAN NAGAR, BANGALORE']
    if loc.upper() in t1:
        return 3
    elif loc.upper() in t2:
        return 2
    else:
        return 1
 

@app.route('/', methods=("POST", "GET"))
def index():
    return render_template('index.html',years=years,months=months,skills=skills)

@app.route('/predict', methods = ['GET','POST'])
def figure(minimum=10, maximum=100, steps=5, rows=50):
    try:
        y = request.json['selectedYear']
        y=int(y)
        m = request.json['selectedMonth']
        m=int(m)
        skill = request.json['selectedSkill']
        loc=request.json['location']
        with open('knnpickle_file', 'rb') as f:
            model=pickle.load(f)
        print(model)
        print("INPUT FETCHED=",y,m,skill,loc)
        
        location= city(loc)
        exp= y+ m/12
        
        s1=s2=s3=s4=s5=0
        
        if skill =='Hybris':
            s1=1
        elif skill == 'Salesforce':
            s2=1
        elif skill == 'Frontend':
            s3=1
        elif skill == 'Java':
            s4=1
        elif skill == 'QA':
            s5=1
            
        param=[[exp,location, s1, s2, s3, s4, s5]]
        print("Type:",type(param))
        res=model.predict(param)
        res=float(np.round(res, 2))
        st="SUCCESS"
    except Exception as e:
        print("\nEXCEPTION TRIGGERED:",e)
        res='NA'
        st='FAILURE'

    print("\nOUTPUT=",res,st)
    result = json.dumps({'predicted_ctc':res,'status':st})
    return result


# # Start the server, continuously listen to requests.
if __name__=="__main__":
    # For local development, set to True:
    # app.run(debug=True)
    # For public web serving:
    app.run(host='0.0.0.0',port = 5000)
    #app.run()