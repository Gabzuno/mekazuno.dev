// Import Firebase modules
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

// Display a loading message
const container = document.querySelector("#newUsersPerMonth");
container.innerHTML = `
    <div style="text-align: center; padding: 50px;">
        <p style="font-size: 18px; color: #888888;">Loading data, please wait...</p>
    </div>`;

// Fetch and process data
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

    // Process user data
    for (const userId in data) {
        const user = data[userId];
        if (user.date_created) {
            const date = new Date(user.date_created);
            const year = date.getFullYear();
            const month = date.getMonth();

            // Count only for the current year
            if (year === currentYear) {
                monthlyCounts[month]++;
            }
        }
    }

    // Clear the loading indicator
    container.innerHTML = "";

    // Prepare chart data
    const chartBarGraph = {
        series: [{
            name: `Users (${currentYear})`,
            data: monthlyCounts
        }],
        chart: {
            height: 350,
            type: 'bar',
            foreColor: '#ffffff'
        },
        title: {
            text: `Year - ${currentYear}`,
            align: 'center',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#ffffff'
            }
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        yaxis: {
            title: {
                text: "No. of New Users Per Month",
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#ffffff'
                }
            },
        },
        colors: ['#00E396'],
        dataLabels: {
            enabled: false
        },
        legend: {
            show: true
        }
    };

    // Render the chart
    const barChart = new ApexCharts(container, chartBarGraph);
    barChart.render();
}).catch((error) => {
    console.error("Error fetching data:", error);
    container.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <p style="font-size: 18px; color: #FF0000; font-weight: bold;">Error loading data. Please try again later.</p>
        </div>`;
});
