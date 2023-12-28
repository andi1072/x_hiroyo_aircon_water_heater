const gradient = window['chartjs-plugin-gradient'];
// Moment
const offsetTz = new Date().getTimezoneOffset()
let dtHumanID = function () {
    const tzCode = parseInt(- (offsetTz / 60))
    if (tzCode > 0) {
        return `+${tzCode}`
    } else {
        return `${tzCode}`
    }
}
let dtHumanName = function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
}
let dtHumanParse = function (isDateTime) {
    if (!isDateTime) { return null }
    var date = {
        utc: isDateTime.toString(),
        offset: offsetTz
    }
    return moment.utc(date.utc).zone(date.offset).format('MMM, DD YYYY HH:mm:ss')
}
// Moment EOF

// Init API
$.ajax({
    type: 'GET',
    url: `https://app.xenxor.com/api/monitor/d/49D80A`,
    dataType: 'json',
    contentType: false,
    cache: false,
    processData: false,
    beforeSend: function () {},
    success: function (res) {
        initPage(res)
        initChart(res)
        initGaug(res)

        $('#lb_id').text(res.data.ftdevice_id)
        $('#lb_area_name').text(res.data.ftarea_name)
        $('#lb_detail_area').text(res.data.ftarea_detail)
        $('#lb_temperature').text(`${res.data.fttemperature}°C`)
        $('#last_update_date').text(dtHumanParse(res.data.fdlast_update))
        $('#lb_location').text(res.data.ftarea_address)
    },
    error: function (err) {
        let _err = JSON.parse(err.responseText)
        console.log(_err)
    },
    complete: function () {},
})
// API EOF

function initPage(res) {
    
    var map = L.map('sensor_map_area', {
        minZoom: 2,
        attributionControl: false,
    }).setView([
        0.33995192349439596, 120.3733680354565
    ], 5)

    var _tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '',
    })
    _tileLayer.addTo(map)

    // // **** Maps Marker
    function _newMarker(latLng, customIcon = null, customToolTip = null, customPopUp = null) {
        var mkr
        if (customIcon) {
            mkr = L.marker(
                latLng,
                customIcon //// { icon: greenIcon }
            )
        } else {
            mkr = L.marker(latLng)
        }
        if (customPopUp) {
            var popup = L.popup().setContent(customPopUp)
            mkr.bindPopup(popup).openPopup()
        }
        if (customToolTip) {
            var tooltip = L.tooltip()
                .setContent(customToolTip)
            mkr.bindTooltip(tooltip).openTooltip()
        }

        mkr.addTo(map)
        return mkr
    }

    var marker = _newMarker({
        lat: res.data.lat, lng: res.data.lng
    }, {
        icon: L.icon({
            iconUrl: `assets/images/temperature-control.png`,
            // shadowUrl: shadowUrl,
            iconSize: [
                [28, 28], //size
                [15, 20], //ancor
                [0, -15] //popancor
            ],
            iconAnchor: [
                [16, 30], //iconsize
                [5, 16], //iconancor
                [0, -25] //popancor
            ],
            popupAnchor: [0, -25]
        })
    }, null, null
    )
    var myFGMarker = new L.FeatureGroup()
    myFGMarker.addLayer(marker)
    myFGMarker.addTo(map)
    map.fitBounds(myFGMarker.getBounds())
}
// **** EOF
// **** CHART INIT
var ctx = document.getElementById('c_history_line').getContext('2d')
// ctx.height = 100
function initChart(res) {
    let cData = JSON.parse(res.data.chartData)
    var data = {
        labels: Object.keys(cData),
        datasets: [{
            label: 'Temperature (°C)',
            data: Object.values(cData),
            // borderColor: '#87C4FF',
            // backgroundColor: 'rgb(34,193,0.1)',
            fill: true,
            tension: 0.1,

            gradient: {
                backgroundColor: {
                    axis: 'y',
                    colors: {
                        25: '#A0E9FF',
                        60: '#FF9130',
                        125: '#F03E3E'
                    }
                },
                borderColor: {
                    axis: 'x',
                    colors: {
                        0: 'white',
                    }
                }
            }
        }]
    }

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: '1 Week History'
        },
        legend: {
            display: true,
            position: 'bottom'
        },
        scales: {
            y: {
                stacked: true,
                min: 0
            },
        }
    }

    ctx.canvas.parentNode.style.height = '300px'
    Chart.register(gradient)
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options,
        plugins: {
            gradient
        }
    })
}
// **** EOF

function initGaug(res) {
    var opts = {
        colorStart: "#6fadcf",
        colorStop: void 0,
        gradientType: 0,
        strokeColor: "#e0e0e0",
        generateGradient: true,
        percentColors: [[0.0, "#a9d70b"], [0.50, "#f9c802"], [1.0, "#ff0000"]],
        pointer: {
            length: 0.8,
            strokeWidth: 0.1,
            color: '#000000'
        },
        staticLabels: {
            font: "10px sans-serif",
            labels: [0, 20, 40, 60, 80, 100], // Cetak label pada nilai-nilai ini
            color: "#414141", // Opsional: Warna teks label
            fractionDigits: 0 // Opsional: Presisi numerik. 0=bulatkan.
        },
        staticZones: [
            { strokeStyle: "#0174BE", min: -30, max: 0 },
            { strokeStyle: "#A0E9FF", min: 0, max: 40 },
            { strokeStyle: "#FF9130", min: 40, max: 80 },
            { strokeStyle: "#F03E3E", min: 80, max: 125 }
        ],
        renderTicks: {
            divisions: 0,
            divWidth: 1.1,
            divLength: 0.7,
            divColor: '#333333',
            subDivisions: 3,
            subLength: 0.5,
            subWidth: 0.6,
            subColor: '#666666'
        },
        angle: 0,
        lineWidth: 0.44,
        radiusScale: 1.0,
        fontSize: 50,
        limitMax: false,
        limitMin: false,
        highDpiSupport: true
    };
    
    var target = document.getElementById('demo')
    var gauge = new Gauge(target).setOptions(opts)
    
    document.getElementById("preview-textfield").className = "preview-textfield"
    gauge.setTextField(document.getElementById("preview-textfield"))
    
    gauge.maxValue = 125
    gauge.setMinValue(-30)
    gauge.set(parseInt(res.data.fttemperature))
    gauge.animationSpeed = 128
}