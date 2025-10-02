// allow user to click between tabs. Used in the about me section

document.addEventListener("DOMContentLoaded", () =>  {
    const tablinks = document.getElementsByClassName("tab-links");
    const tabcontents = document.getElementsByClassName("tab-contents");
    
    window.opentab = function (tabname, event) 
    {
        for(let tablink of tablinks){
            tablink.classList.remove("active-link");
        }
        for(let tabcontent of tabcontents){
            tabcontent.classList.remove("active-tab");
        }
        
        event.currentTarget.classList.add("active-link");
        document.getElementById(tabname).classList.add("active-tab");
    }
});


// script to submit contact information to a google sheet

// tutorial from https://www.youtube.com/watch?v=0YFrGy_mzjY

  const scriptURL = 'https://script.google.com/macros/s/AKfycbz1mXwISMLHaSak92yS67lLsIbc78TsPjcT8I0fdNmj1OvzGhLGsmglthqrII_qeIc2/exec'
  const form = document.forms['submit-to-google-sheet']
  const msg = document.getElementById("msg")
  
  form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => {
                        msg.innerHTML = "Message Sent Successfully"
                        setTimeout(function(){
                            msg.innerHTML = ""
                        }, 5000)
                        form.reset();
                        })
      .catch(error => console.error('Error!', error.message))
  })
    
