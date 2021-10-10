## How to run the application
In order to run the application, first make sure you provide a mongodb instance on port `27017`. \
Using Docker you can run:
```
docker run -p 27017:27017 -d mongo:4.0
```

This will port-forward a mongodb instance.

Then navigate to the projects root directory and run:
1.  `npm install` 
2.  `node src/index.js`

That'll start the node process on port 3000 by default. If you wish to run on another `PORT` you can do so by:    
- `PORT=<port_number> node src/index.js`
    
&nbsp;

---

## Swagger documentations
There are swagger docs available here http://localhost:3000/api/v1/api-docs/ (when using the default port)
  
In the swagger ui, you can see the request and response example, you can also use it to test the endpoints by sending actuall requests.     

&nbsp;

## Sending requests through Swagger ui

Choose an endpoint and click on **Try it out**, fill the required fields and **Execute**.

&nbsp;

---

## Sending requests manually
In case you want to not use swagger to make api calls, you can use `cURL` instead.
- to create a new survey:
    ```
    curl --header "Content-Type: application/json" \
         --request POST \
         --data '{"question":"What is your favorite color?", "options":["Red","Green","Blue"]}' \
         http://localhost:3000/api/v1/survey/new 
    ```
- to answer a survey:    
    ```
    curl --header "Content-Type: application/json" \
         --request POST \
         --data '{"answer":"Red"}' \
         http://localhost:3000/api/v1/answer/<survey_id>/new 
    ```
- to get the results of a survey:    
    ```
    curl --header "Content-Type: application/json" \
         --request GET \
         http://localhost:3000/api/v1/answer/<survey_id>/results 
    ```

&nbsp;

---
    
## How to run the unit tests
The tests (for the services) also require a mongodb instance to be running.  
Use the docker command mentioned above to porvide a mongodb instance using docker.  

In order to run the unit tests, use the following command:
- `npm run test`
