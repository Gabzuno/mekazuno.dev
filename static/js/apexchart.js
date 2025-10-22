/*DATE*/
document.addEventListener("DOMContentLoaded", function () {
  const dateElement = document.getElementById("currentDate");

  const date = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString(undefined, options);

  dateElement.textContent = formattedDate;
});

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
const registeredAccountsRef = ref(database, 'Registered_Accounts');

// Fetch the accounts and count them
get(registeredAccountsRef).then((snapshot) => {
  const accounts = snapshot.val();
  const activeUsers = accounts ? Object.keys(accounts).length : 0; // Assuming all users are active
  const inactiveUsers = 0; // No inactive users for now

  // Update counts in the cards
  document.getElementById("activeUsersCount").innerText = activeUsers;
  document.getElementById("inactiveUsersCount").innerText = inactiveUsers;

  // var chartBarGraph = {
  //   series: [
  //     {
  //       name: 'Actual',
  //       data: [
  //         {
  //           x: '2011',
  //           y: 1292,
  //           goals: [
  //             {
  //               name: 'Expected',
  //               value: 1400,
  //               strokeHeight: 5,
  //               strokeColor: '#775DD0'
  //             }
  //           ]
  //         },
  //         {
  //           x: '2012',
  //           y: 4432,
  //           goals: [
  //             {
  //               name: 'Expected',
  //               value: 5400,
  //               strokeHeight: 5,
  //               strokeColor: '#775DD0'
  //             }
  //           ]
  //         },
  //         {
  //           x: '2013',
  //           y: 5423,
  //           goals: [
  //             {
  //               name: 'Expected',
  //               value: 5200,
  //               strokeHeight: 5,
  //               strokeColor: '#775DD0'
  //             }
  //           ]
  //         },
  //         {
  //           x: '2014',
  //           y: 6653,
  //           goals: [
  //             {
  //               name: 'Expected',
  //               value: 6500,
  //               strokeHeight: 5,
  //               strokeColor: '#775DD0'
  //             }
  //           ]
  //         },
  //         {
  //           x: '2015',
  //           y: 8133,
  //           goals: [
  //             {
  //               name: 'Expected',
  //               value: 6600,
  //               strokeHeight: 13,
  //               strokeWidth: 0,
  //               strokeLineCap: 'round',
  //               strokeColor: '#775DD0'
  //             }
  //           ]
  //         },
  //         {
  //           x: '2016',
  //           y: 7132,
  //           goals: [
  //             {
  //               name: 'Expected',
  //               value: 7500,
  //               strokeHeight: 5,
  //               strokeColor: '#775DD0'
  //             }
  //           ]
  //         },
  //         {
  //           x: '2017',
  //           y: 7332,
  //           goals: [
  //             {
  //               name: 'Expected',
  //               value: 8700,
  //               strokeHeight: 5,
  //               strokeColor: '#775DD0'
  //             }
  //           ]
  //         },
  //         {
  //           x: '2018',
  //           y: 6553,
  //           goals: [
  //             {
  //               name: 'Expected',
  //               value: 7300,
  //               strokeHeight: 2,
  //               strokeDashArray: 2,
  //               strokeColor: '#775DD0'
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ],
  //   chart: {
  //     height: 350,
  //     type: 'bar',
  //     foreColor: '#ffffff'
  //   },
  //   plotOptions: {
  //     bar: {
  //       columnWidth: '60%'
  //     }
  //   },
  //   colors: ['#00E396'],
  //   dataLabels: {
  //     enabled: false
  //   },
  //   legend: {
  //     show: true,
  //     showForSingleSeries: true,
  //     customLegendItems: ['Actual', 'Expected'],
  //     markers: {
  //       fillColors: ['#00E396', '#775DD0']
  //     }
  //   }
  // };

  // var barChart = new ApexCharts(document.querySelector("#newUsersPerMonth"), chartBarGraph);
  // barChart.render();

  // Set up the data for the chart
  const donutGraph = {
    chart: {
      type: 'donut',
      height: '100%',
    },
    series: [activeUsers, inactiveUsers], // Active and Inactive users
    labels: ['Active Users', 'Inactive Users'],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '22px',
              fontWeight: 600,
              color: '#ffffff', // White font for the label name
              offsetY: 20
            },
            value: {
              fontSize: '16px',
              fontWeight: 400,
              color: '#ffffff', // White font for the value
              offsetY: -20
            }
          }
        }
      }
    },
    colors: ['#4CAF50', '#F44336'], // Green for active, Red for inactive
    theme: {
      mode: 'dark' // Ensure overall dark theme for better contrast
    }
  };

  // Render the chart
  const chartpieGraph = new ApexCharts(document.querySelector("#chart3"), donutGraph);
  chartpieGraph.render();
});

