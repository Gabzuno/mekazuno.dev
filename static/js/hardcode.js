//Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD56TvVuz9rl9wvRN9VhkJH_Gz8WHpFh_Q",
    authDomain: "spectre-8f79c.firebaseapp.com",
    databaseURL: "https://spectre-8f79c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "spectre-8f79c",
    storageBucket: "spectre-8f79c.appspot.com",
    messagingSenderId: "875337744237",
    appId: "1:875337744237:web:d2dd76f311523b30b56464",
    measurementId: "G-13VZ185YFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the 'Registered_Accounts' node
const accountsRef = ref(database, "Registered_Accounts");

// // Display a loading message
const container = document.querySelector("#detectionPerMonth");
container.innerHTML = `
    <div style="text-align: center; padding: 50px;">
        <p style="font-size: 18px; color: #888888;">Loading data, please wait...</p>
    </div>`;

// // Fetch and process data
get(accountsRef).then((snapshot) => {
    const data = snapshot.val();

    if (!data) {
        container.innerHTML = ` 
            <div style="text-align: center; padding: 50px;">
                <p style="font-size: 18px; color: #000000; font-weight: bold;">No Data Available</p>
            </div>`;
        return;
    }

    const currentYear = new Date().getFullYear();
    const monthlyCounts = Array(12).fill(0); // Initialize counts for 12 months

    // Process detection data
    for (const userId in data) {
        const user = data[userId];
        if (user.Detection) {
            // Check detections for each camera (Camera 1 to Camera 4)
            for (const camera in user.Detection) {
                const detections = user.Detection[camera];

                // Make sure the camera data exists
                if (Array.isArray(detections)) {
                    detections.forEach(detection => {
                        // Check if the detection type is 'Shoplifting'
                        if (detection.type === "Shoplifting") {
                            const date = new Date(detection.date);
                            const year = date.getFullYear();
                            const month = date.getMonth();

                            // Count only for the current year
                            if (year === currentYear) {
                                monthlyCounts[month]++;
                            }
                        }
                    });
                }
            }
        }
    }

    // Clear the loading indicator
    container.innerHTML = "";

    // Prepare chart data
    var options = {
        series: [{
            name: 'Shoplifting',
            data: [35, 10, 1, 0, 0, 7, 0, 8, 9, 0, 6, 0]
        }],
        chart: {
            type: 'bar',
            height: 350,
            foreColor: '#ffffff'
        },
        title: {
            text: `Shoplifting`,
            align: 'center',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#ffffff'
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 5,
                borderRadiusApplication: 'end'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yaxis: {
            title: {
                text: 'No. of Detection Per Month'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val
                }
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#detectionPerMonth"), options);
    chart.render();

});