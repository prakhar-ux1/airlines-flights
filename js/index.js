const airlines_code = await fetch('./json/airlines.json')
    .then((response) => response.json())
    .then((json) => { return json; });
//console.log("this is map we want-", airline_maps);
const airline_maps = new Map(
    airlines_code.map(element => {
        return [element.iata, element.name];
    }),
);
// ----------------------
function get_date_format(date) {
    return (date.getDate() + " " + date.toDateString().substring(4, 7) + " " + date.getFullYear());
}

function get_time(date) {
    return (date.getHours() + ":" + date.getMinutes());
}
function get_time_diff(date1, date2) {
    let dif = (Math.abs(date1 - date2) / 1000);
    let days = Math.floor(dif / 86400);
    dif -= days * 86400;
    let res = "";
    if (days == 1)
        res += days + " day ";
    else if (days > 1)
        res += days + " days "

    let hr = Math.floor(dif / 3600) % 24;
    dif -= hr * 3600;
    let minut = Math.floor(dif / 60) % 60;

    if (hr > 0 || hr == 0)
        res += hr + " Hours ";

    if (minut > 0)
        res += minut + " Minutes";

    return res;
}
function create_div(class_Name, inner__Text) {
    let element = document.createElement("div");
    element.className = class_Name;

    if (inner__Text !== undefined)
        element.innerText = inner__Text;

    return element

}
function get_depature_detail(element) {
    let date = new Date(element.OriginDestinationOptions[0].FlightSegments[0].DepartureDateTime);
    let location = element.OriginDestinationOptions[0].FlightSegments[0].DepartureAirportLocationCode;
    return [date, location];

}
function get_arrival_detail(element) {
    let date = new Date(element.OriginDestinationOptions[0].FlightSegments[0].ArrivalDateTime);
    let location = element.OriginDestinationOptions[0].FlightSegments[0].ArrivalAirportLocationCode;
    return [date, location];

}
function get_stops_value(element) {
    return element.OriginDestinationOptions[0].FlightSegments[0].StopQuantity + " Stops";
}

function create_details_comp(time_type, date, location) {

    let parent_comp = create_div(time_type)
    let date_comp = create_div("date", get_date_format(date));
    let location_comp = create_div("location", location);
    let time_comp = create_div("time", get_time(date));
    parent_comp.appendChild(time_comp);
    parent_comp.appendChild(location_comp);
    parent_comp.appendChild(date_comp);
    return parent_comp;
}

function create_detailsArrDept_comp(element) {
    let [arr_date, arr_location] = get_arrival_detail(element);
    let [dept_date, dept_location] = get_depature_detail(element);
    let time_gap = get_time_diff(arr_date.getTime(), dept_date.getTime());
    let stops_value = get_stops_value(element);

    let Detail_AD_comp = create_div("details");
    let departure_comp = create_details_comp("depature", dept_date, dept_location);
    let arrival_comp = create_details_comp("arrival", arr_date, arr_location);

    let stop_duration_comp = create_div("stops_duration");
    let duration_comp = create_div("duration", time_gap);
    let stops_comp = create_div("stops", stops_value);
    stop_duration_comp.appendChild(duration_comp);
    stop_duration_comp.appendChild(stops_comp);

    Detail_AD_comp.appendChild(departure_comp);
    Detail_AD_comp.appendChild(stop_duration_comp);
    Detail_AD_comp.appendChild(arrival_comp);
    return Detail_AD_comp;
}
function get_booking_price(element) {
    return element.AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount + " " + element.AirItineraryPricingInfo.ItinTotalFare.TotalFare.CurrencyCode;
}
function onClick_booking(arr_location, dept_location, dept_date) {
    let urlRedirect = new URL("http://127.0.0.1:5501/Confirmpage.html");
    window.localStorage.setItem("arr", arr_location);
    window.localStorage.setItem("date", dept_date);
    window.localStorage.setItem("dept", dept_location);
    console.log(urlRedirect.toString());
    window.location.assign(urlRedirect);
}
function create_booking_div(element) {
    // get_price
    let flight_price = get_booking_price(element);
    let parent_booking_div = create_div("booking");
    let book_comp = create_div("book", "Book Ticket");
    let price_comp = create_div("price", flight_price);
    parent_booking_div.appendChild(book_comp);
    parent_booking_div.appendChild(price_comp);
    // set on click listener for booking
    let [arr_date, arr_location] = get_arrival_detail(element);
    let [dept_date, dept_location] = get_depature_detail(element);
    //set_onClick_eventlistener for confimation page.
    parent_booking_div.addEventListener('click', function () {
        onClick_booking(arr_location, dept_location, get_date_format(dept_date));
    });

    return parent_booking_div;
}
function create_card_comp(element) {
    let card = create_div("card");
    // set attribute for filtering 
    card.setAttribute("fl", element.ValidatingAirlineCode);
    // get airline_name and create flight_name_component
    let get_airline_name = airline_maps.get(element.ValidatingAirlineCode);
    let airline_name_comp = create_div("flights-details", get_airline_name);
    //create_flight_detail component
    let flight_detail_comp = create_detailsArrDept_comp(element);
    //booking_component
    let booking_comp = create_booking_div(element);

    card.appendChild(airline_name_comp);
    card.appendChild(flight_detail_comp);
    card.appendChild(booking_comp);
    return card;
}
function filter_airlines() {
    let checkBoxes = document.querySelectorAll('input[type="checkbox"]');

    checkBoxes.forEach((element) => {
        //  console.log(element)

        element.addEventListener('change', (e) => {
            let isd = 'div[fl="' + element.getAttribute("id") + '"]';
            let find_card = document.querySelectorAll(isd);
            if (e.target.checked) {
                find_card.forEach(element => {
                    element.style.display = "";
                })
            }
            else {
                find_card.forEach(element => {
                    element.style.display = "none";
                })
            }
        })
    })


}

function get_airlines() {
    let fC = document.getElementById("side_list")
    airlines_code.forEach(element => {

        let checkbox = document.createElement('div');
        let input_checkbox = document.createElement('input');
        let label_checkbox = document.createElement('label');
        input_checkbox.setAttribute("type", "checkbox");
        input_checkbox.setAttribute("id", element.iata);
        label_checkbox.className = "checkbox";
        label_checkbox.setAttribute("for", element.iata);
        label_checkbox.innerText = element.name;
        input_checkbox.defaultChecked = true;
        checkbox.append(input_checkbox);
        checkbox.appendChild(label_checkbox);
        fC.appendChild(checkbox);
    })

}

const flight_list = await fetch('./json/result.json')
    .then((response) => response.json())
    .then((json) => { return json; });

//View_Component Which contains list of card Views
const view_Component = document.getElementById("view");
flight_list.Data.PricedItineraries.forEach(element => {
    let card = create_card_comp(element);
    view_Component.appendChild(card);
});
get_airlines();
filter_airlines();

















