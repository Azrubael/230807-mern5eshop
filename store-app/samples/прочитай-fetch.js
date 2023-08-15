// Sending POST Request in JavaScript
fetch('https://reqbin.com/echo/post/json', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "id": 78912 })
})
   .then(response => response.json())
   .then(response => console.log(JSON.stringify(response)))
   
   
// Making a GET request with JavaScript   
fetch('https://reqbin.com/echo/get/json', {
   headers: {
      'Accept': 'application/json'
   }
})
   .then(response => response.text())
   .then(text => console.log(text))