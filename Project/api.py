


from flask import Flask, request, jsonify, render_template   # Importing libraries
import pickle
from flask_cors import CORS

app = Flask(__name__)      #creating an instance of the Flask application and __name__ is  the  name of current module




CORS(app) # enabling Cross-Origin Resource Sharing


model = pickle.load(open('final.pkl','rb'))  #Loading the trained ML model from 'final.pkl' file







#fetching the inputs and displaying of the predicted  output 

@app.route('/predict', methods=['POST'])  
def predict():


    data=request.json # fetching data which is entered in the form

    # segregating  the inputs and  then typecasting  it since they are in string and model takes integers
    
    p1 = int(data['age'])
    p2 = int(data['annual_income'])
    p3 = int(data['spending_score'])

    if p3 > 100:    
        return "Error: Spending score should not be greater than 100"

    #  Making a prediction  of which cluster does the particular customer belongs using the loaded model

    result = model.predict([[p1, p2, p3]]) 


#Mapping the predicted cluster into thier respective names and labels

    category = {              # this dictonary maps the cluster number to descriptive group name
        0: "Sensible group",
        1: "Target group",
        2: "Careful group",
        3: "Careless group",
        4: "Standard group"
    }
   #labels dictionary maps the cluster number to a detailed label that describes the income and spending behavior of that cluster

    labels = {                     
        0: " low income and low spender",
        1: " middle  to high income and high spenders(should targeted by mall)",
        2: " high income but low  spenders ",
        3: " Low income but high spenders (should be avoided because of possible credit risk)",
        4: " Middle income and medium spenders(to moderately targeted)"
    }    
         # Create a dictionary that contains information about the predicted cluster based on the machine learning model's output.
    prediction = {                   
        'cluster': int(result),
        'label': labels[int(result)],
        'category' : category[int(result)]
    }
    
    return jsonify(prediction)   #return  prediction as JSON response
    

if __name__ == '__main__':              # Running the Flask application in debug mode on port 9000
     app.run(debug=True, port=9000)
    


