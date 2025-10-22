// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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
const auth = getAuth(app);

// Listen for the user's authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;

        // Reference to the 'Detection' node of the logged-in user
        const detectionRef = ref(database, `Registered_Accounts/${uid}/Detection`);

        // Fetch the data
        get(detectionRef).then((snapshot) => {
            const data = snapshot.val();

            if (!data) {
                // No data found, display empty state
                document.querySelector("#detectionPerMonth").innerHTML = ` 
                    <div style="text-align: center; padding: 50px;">
                        <p style="font-size: 18px; color: #000000; font-weight: bold;">No Data Available</p>
                    </div>`;
                return;
            }

            const monthlyData = {
                Shoplifting: Array(12).fill(0), // Initialize 12 months for Shoplifting
            };

            // Loop through each camera and each detection
            for (const camera in data) {
                for (const detectionId in data[camera]) {
                    const detection = data[camera][detectionId];
                    const date = new Date(detection.date);  // Convert to Date object
                    const month = date.getMonth();         // Get the month (0-11)

                    // Increment count based on detection type
                    if (detection.type === "Shoplifting") {
                        monthlyData.Shoplifting[month]++;
                    }
                }
            }

            // Prepare data for the chart
            var options = {
                series: [{
                    name: 'Shoplifting',
                    data: monthlyData.Shoplifting
                }],
                chart: {
                    type: 'bar',
                    height: '350'
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
                        text: 'No. of Detections'
                    }
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + " detections"
                        }
                    }
                },
                responsive: [{
                    breakpoint: 768, // For tablets and mobile devices
                    options: {
                        chart: {
                            height: 250
                        },
                        plotOptions: {
                            bar: {
                                columnWidth: '65%' // Slightly narrower bars
                            }
                        },
                        legend: {
                            position: 'bottom', // Move legend to bottom for small screens
                            fontSize: '10px'
                        }
                    }
                }]
            };

            // Render the chart
            var chart = new ApexCharts(document.querySelector("#detectionPerMonth"), options);
            chart.render();
        }).catch((error) => {
            console.error("Error fetching data:", error);
        });
    } else {
        console.log("No user is signed in.");
    }
});
