
function send_push(text) {
  const data = {
    app_id: process.env.ONESIGNAL_APP_ID,
    contents: {
      en: text,
    },
    included_segments: ['All Users']
  }

  const options = { 
    method: 'POST', 
    body: JSON.stringify(data), 
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Basic " + process.env.ONESIGNAL_API_KEY
    } 
  }

  return fetch('https://onesignal.com/api/v1/notifications', options)
    .then(res => res.json())
    .then(data => console.log(data))
    
}

module.exports = {send_push}