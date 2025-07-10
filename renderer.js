
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("input").forEach((el) => {
        // Lade gespeicherte Werte
        const saved = localStorage.getItem(el.id);
        if (saved !== null) el.value = saved;

        // Event Listener mit Speicherung
        el.addEventListener("input", () => {
            localStorage.setItem(el.id, el.value);
            calculate();
        });
    });

    calculate();
});


function get(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function calculate() {
    const baseGold = 400;
    const timeReduction = get("timeReduction") / 100;
    const costReduction = get("costReduction") / 100;
    const greaterSuccess = get("greaterSuccess") / 100;
    const specialSuccess = get("specialSuccess") / 100;
    const successMultiplier = 1 + greaterSuccess * (1 + specialSuccess);

    const timePerCraft = 1 * (1 - timeReduction);
    const craftsPerDay = Math.floor((24 / timePerCraft) * 4);
    const costGold = Math.floor(baseGold * (1 - costReduction));

    const uncommon = 86;
    const common = 45;
    const abidos = 33;

    const priceCommon = get("woodCommon") / 100;
    const priceUncommon = get("woodUncommon") / 100;
    const priceAbidos = get("woodAbidos") / 100;
    const priceSturdy = get("woodSturdy") / 100;

    const abidosFromSturdy = 1.25 * priceSturdy;
    const commonFromSturdy = 0.1 * priceSturdy;

    const effectiveAbidos = Math.min(priceAbidos, abidosFromSturdy);
    const effectiveCommon = Math.min(priceCommon, commonFromSturdy);

    const materialCost = uncommon * priceUncommon + common * effectiveCommon + abidos * effectiveAbidos;
    const totalCost = materialCost + costGold;

    const averageOutput = 10 * successMultiplier;
    const pricePerFusion = get("abidosPrice");
    const auctionTax = 1 / 20; // 5%
    const netRevenue = averageOutput * pricePerFusion * (1 - auctionTax);

    const profitPerCraft = Math.floor(netRevenue - totalCost);
    const profit40 = profitPerCraft * 40;
    const profitPerDay = profitPerCraft * craftsPerDay;

    document.getElementById("results").innerHTML = `
    <ul>
      <li><b>Gewinn pro Craft:</b> ${profitPerCraft}g</li>
      <li><b>Gewinn für 40 Crafts:</b> ${profit40}g</li>
      <li><b>Gewinn pro Tag (mit 4 Slots):</b> ${profitPerDay}g</li>
    </ul>
  `;

    updateShoppingList(effectiveAbidos === abidosFromSturdy, effectiveCommon === commonFromSturdy);
    updateTradeAnalysis(craftsPerDay, profitPerDay);
    updateChart();
}

function updateShoppingList(useSturdyForAbidos, useSturdyForCommon) {
    const list = document.getElementById("shoppingList");
    list.innerHTML = "";

    const totalUncommon = 86 * 40;
    const totalCommon = 45 * 40;
    const totalAbidos = 33 * 40;

    if (useSturdyForAbidos) {
        const neededSturdy = Math.ceil((totalAbidos / 80) * 100);
        list.innerHTML += `<li><b style="color:green">Sturdy Wood:</b> ${neededSturdy}</li>`;
        list.innerHTML += `<li>→ ${totalAbidos} Abidos Wood</li>`;
    } else {
        list.innerHTML += `<li><b>Abidos Wood:</b> ${Math.ceil(totalAbidos / 100) * 100}</li>`;
    }

    if (useSturdyForCommon) {
        const neededSturdy = Math.ceil((totalCommon / 1000) * 100);
        list.innerHTML += `<li><b style="color:green">Sturdy Wood:</b> ${neededSturdy}</li>`;
        list.innerHTML += `<li>→ ${totalCommon} Common Wood</li>`;
    } else {
        list.innerHTML += `<li><b>Common Wood:</b> ${Math.ceil(totalCommon / 100) * 100}</li>`;
    }

    list.innerHTML += `<li><b>Uncommon Wood:</b> ${Math.ceil(totalUncommon / 100) * 100}</li>`;
}

let priceChart;
function updateChart() {
    const sturdyPrice = get("woodSturdy") / 100;
    const abidosPrice = get("woodAbidos") / 100;
    const commonPrice = get("woodCommon") / 100;

    const sturdyToAbidos = 1.25 * sturdyPrice;
    const sturdyToCommon = 0.1 * sturdyPrice;

    const ctx = document.getElementById("priceChart").getContext("2d");
    const labels = ["Direkt", "Via Sturdy"];
    const abidosData = [abidosPrice, sturdyToAbidos];
    const commonData = [commonPrice, sturdyToCommon];

    if (priceChart) priceChart.destroy();

    priceChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Abidos (g/Unit)",
                    data: abidosData,
                    backgroundColor: ["#dc3545", "#28a745"],
                },
                {
                    label: "Common (g/Unit)",
                    data: commonData,
                    backgroundColor: ["#ffc107", "#17a2b8"],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(2)}g`;
                        },
                    },
                },
                legend: { position: "top" },
                title: {
                    display: true,
                    text: "Preisvergleich: Direktkauf vs. Sturdy-Tausch",
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "Gold pro Einheit" },
                },
            },
        },
    });
}

function updateTradeAnalysis(craftsPerDay, profitPerDay) {
    const analysis = document.getElementById("tradeAnalysis");
    analysis.innerHTML = "";

    const sturdyPrice = get("woodSturdy") / 100;
    const abidosPrice = get("woodAbidos") / 100;
    const commonPrice = get("woodCommon") / 100;

    const sturdyToAbidos = 1.25 * sturdyPrice;
    const sturdyToCommon = 0.1 * sturdyPrice;

    const abidosDiff = abidosPrice - sturdyToAbidos;
    const commonDiff = commonPrice - sturdyToCommon;

    if (abidosDiff > 0) {
        analysis.innerHTML += `💡 <b>Abidos:</b> Durch Sturdy-Tausch sparst du <b>${abidosDiff.toFixed(2)}g</b> pro Einheit → <b>${Math.round(abidosDiff * 33 * craftsPerDay)}g/Tag</b><br>`;
    } else {
        analysis.innerHTML += `📌 <b>Abidos:</b> Direkter Kauf ist <b>${Math.abs(abidosDiff).toFixed(2)}g</b> günstiger.<br>`;
    }

    if (commonDiff > 0) {
        analysis.innerHTML += `💡 <b>Common:</b> Durch Sturdy-Tausch sparst du <b>${commonDiff.toFixed(2)}g</b> pro Einheit → <b>${Math.round(commonDiff * 45 * craftsPerDay)}g/Tag</b><br>`;
    } else {
        analysis.innerHTML += `📌 <b>Common:</b> Direkter Kauf ist <b>${Math.abs(commonDiff).toFixed(2)}g</b> günstiger.<br>`;
    }
}

calculate();
