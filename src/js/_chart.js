pikaDeck.chart = {};

(function() {
    "use strict";

    this.supertype = function () {

        var ctx = $("#supertypeChart");

        var supertype = pikaDeck.store.get('deckStats').counts.supertype;

        var options = {
            type: 'bar',
            data: {
                labels: ["Pokémon", "Trainer", "Energy"],
                datasets: [{
                    label: '# of Cards',
                    data: [
                        supertype.pokemon,
                        supertype.trainer,
                        supertype.energy
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        };

        var supertypeChart = new Chart(ctx, options);

    };


}).apply(pikaDeck.chart);
