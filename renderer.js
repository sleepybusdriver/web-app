document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    'abidosMV', 'timeReduction', 'goldPerCraft', 'greaterSucChance',
    'energyCost', 'energyRegen', 'weeklyEnergy'
  ];

  inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', calculate);
  });

  function calculate() {
    const abidosMV = parseFloat(document.getElementById('abidosMV').value) || 0;
    const timeReduction = parseFloat(document.getElementById('timeReduction').value) || 0;
    const goldPerCraft = parseFloat(document.getElementById('goldPerCraft').value) || 0;
    const greaterSucChance = parseFloat(document.getElementById('greaterSucChance').value) || 0;
    const energyCost = parseFloat(document.getElementById('energyCost').value) || 0;
    const energyRegen = parseFloat(document.getElementById('energyRegen').value) || 0;
    const weeklyEnergy = parseFloat(document.getElementById('weeklyEnergy').value) || 0;

    // Gesamtenergie pro Woche (inkl. täglichem Regenerieren)
    const totalEnergy = weeklyEnergy + energyRegen * 7;

    // Wie viele Crafts passen in die Woche
    const craftsPerWeek = Math.floor(totalEnergy / energyCost);
    const craftsPerDay = craftsPerWeek / 7;
    const goldPerDay = craftsPerDay * goldPerCraft;

    document.getElementById('totalEnergyWeek').innerText = totalEnergy.toFixed(0);
    document.getElementById('craftsPerDay').innerText = craftsPerDay.toFixed(1);
    document.getElementById('goldPerDay').innerText = goldPerDay.toFixed(0);
  }

  calculate(); // Initial berechnen
});
