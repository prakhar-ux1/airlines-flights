function set_confirmation_value()
{
    document.getElementById("arr").innerText = window.localStorage.getItem("arr");
    document.getElementById("dept").innerText = window.localStorage.getItem("dept");
    document.getElementById("date").innerText = window.localStorage.getItem("date");
}
set_confirmation_value();


