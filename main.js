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
    
