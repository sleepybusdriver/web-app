const inputs = [
    'abdiosPrice',
    'blueCrystalPrice',
    'woodCommon',
    'woodUncommon',
    'woodSturdy',
    'woodAbidos'
];

inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', updateOutput);
});

function getNumber(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function updateOutput() {
    const abdios = getNumber('abdiosPrice');
    const crystal = getNumber('blueCrystalPrice');
    const woodCommon = getNumber('woodCommon');
    const woodUncommon = getNumber('woodUncommon');
    const woodSturdy = getNumber('woodSturdy');
    const woodAbidos = getNumber('woodAbidos');

    const sessionTotal = abdios + crystal + woodCommon + woodUncommon + woodSturdy + woodAbidos;
    const dayTotal = sessionTotal * 3;

    document.getElementById('outputSession').textContent = sessionTotal.toFixed(2);
    document.getElementById('outputDay').textContent = dayTotal.toFixed(2);
}
