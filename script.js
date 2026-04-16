const RAÇA_CLASSE = {
    racas: {
        "Andróide": { int_b: 2, for_b: 1, sab_b: -1 },
        "Celeosk": { int_b: 2, sab_b: 1, for_b: -1 },
        "Conduir": { per_b: 2, des_b: 1, con_b: -1 },
        "Demonsk": { con_b: 2, sab_b: 1, car_b: -1 },
        "Elfim": { sab_b: 2, per_b: 1, int_b: -1 },
        "Humano": { },
        "Krajuru": { per_b: 2, des_b: 1, con_b: -1 },
        "Muron": { con_b: 2, for_b: 1, per_b: -1 },
        "Nebulofita": { car_b: 2, int_b: 1, sab_b: -1 },
        "Reptiliano": { des_b: 2, for_b: 1, car_b: -1  },
        "Slimud": { per_b: 2, des_b: 1, per_b: -1 },
        "Tiano": { for_b: 2, con_b: 1, int_b: -1 },
        "Tribuiru": { des_b: 2, sab_b: 1, car_b: -1 },
        "Venomud": { sab_b: 2, des_b: 1, for_b: -1 },
        "Híbrido": {},
    },
    classes: {
        "Apostador": { hp_base: 7, hp_level: 2, ca_base: 15 },
        "Atirador": { hp_base: 9, hp_level: 2, ca_base: 15 },
        "Berserker": { hp_base: 12, hp_level: 3, ca_base: 15 },
        "Caçador": { hp_base: 10, hp_level: 3, ca_base: 15 },
        "Contador de Odisséia": { hp_base: 8, hp_level: 1, ca_base: 15 },
        "Devotado": { hp_base: 9, hp_level: 2, ca_base: 15 },
        "Dobrador": { hp_base: 8, hp_level: 2, ca_base: 15 },
        "Inventor": { hp_base: 10, hp_level: 2, ca_base: 15 },
        "Lutador": { hp_base: 9, hp_level: 3, ca_base: 15 },
        "Médico": { hp_base: 9, hp_level: 1, ca_base: 15 },
        "Piloto": { hp_base: 8, hp_level: 3, ca_base: 15 },
        "Samurai": { hp_base: 12, hp_level: 2, ca_base: 15 },
        "Tanque": { hp_base: 10, hp_level: 3, ca_base: 15 },
        "Taoísta": { hp_base: 7, hp_level: 2, ca_base: 15 },
    }
};

function carregarFicha() {
    const salvo = localStorage.getItem('dadosFichaNebula');
    if (salvo) {
        const dados = JSON.parse(salvo);
        Object.keys(dados).forEach(id => {
            const campo = document.getElementById(id);
            if (campo) {
                if (campo.type === "checkbox") {
                    campo.checked = dados[id];
                } else {
                    campo.value = dados[id];
                }
            }
        });
    }
    calc();
}

function calc() {
    const v = (id) => parseInt(document.getElementById(id).value) || 0;
    const t = (id) => document.getElementById(id).checked;
    const s = (id) => document.getElementById(id).value;
    const set = (id, val) => {
        const el = document.getElementById(id);
        if(el) el.innerText = val;
    };

    // Pegar Raça e Classe selecionadas
    const racaNome = s('raca');
    const classeNome = s('classe');
    const racaSel = RAÇA_CLASSE.racas[racaNome] || {};
    const classeSel = RAÇA_CLASSE.classes[classeNome] || { hp_base: 0, hp_level: 0, ca_base: 10 };
    const nivel = v('nivel');

    // --- ATRIBUTOS COM BÔNUS DE RAÇA ---
    const FOR = v('for_base') + v('for_bonus') + (racaSel.for_b || 0);
    const CON = v('con_base') + v('con_bonus') + (racaSel.con_b || 0);
    const DES = v('des_base') + v('des_bonus') + (racaSel.des_b || 0);
    const INT = v('int_base') + v('int_bonus') + (racaSel.int_b || 0);
    const SAB = v('sab_base') + v('sab_bonus') + (racaSel.sab_b || 0);
    const PER = v('per_base') + v('per_bonus') + (racaSel.per_b || 0);
    const CAR = v('car_base') + v('car_bonus') + (racaSel.car_b || 0);

    //Atualiza os spans
    set('v_for_total', FOR);
    set('v_con_total', CON);
    set('v_des_total', DES);
    set('v_int_total', INT);
    set('v_sab_total', SAB);
    set('v_per_total', PER);
    set('v_car_total', CAR);

    // --- CÁLCULOS DE HP E CA (REGRAS NOVAS) ---
    // HP = (Base + CON) + (LevelUp + CON) * (Nível - 1)
    const hpTotal = (classeSel.hp_base + CON) + ((classeSel.hp_level + CON) * (nivel - 1));
    set('v_hp', hpTotal);

    const hpAtual = v('hp_atual');

// 3. Lógica de Status Automática
const statusLabel = document.getElementById('status_label');

if (hpAtual <= 0) {
    set('status_label', "INOPERANTE");
    statusLabel.style.color = "#ff0000"; // Vermelho Alerta
    statusLabel.style.textShadow = "0 0 15px #ff0000";
} else {
    set('status_label', "OPERANTE");
    statusLabel.style.color = "#00ff00"; // Verde Sistema OK
    statusLabel.style.textShadow = "0 0 15px #00ff00";
}
    // CA = CA Base da Classe + CON
    const bonusExternoCA = v('ca_bonus') || 0; 
const caTotal = (classeSel.ca_base || 10) + CON + bonusExternoCA;

set('v_ca', caTotal);
    // --- APTIDÕES ---
    set('v_ref', t('t_ref') ? (DES + PER) : DES);
    set('v_mir', t('t_mir') ? (PER + " +V") : PER); // Mira
    set('v_for', t('t_for') ? (CON + FOR) : CON);
    set('v_acr', t('t_acr') ? (DES + FOR) : DES);
    
    const valConhec = t('t_conh') ? (INT + SAB) : INT;
    set('v_conh', valConhec);
    
    const valLabia = t('t_lab') ? (CAR + PER) : CAR;
    set('v_lab', valLabia);
    
    set('v_bar',  t('t_bar')  ? (CAR + valLabia) : CAR);
    set('v_rep',  t('t_rep')  ? (INT + valConhec) : INT);
    
    set('v_fur', t('t_fur') ? (DES + " +V") : DES);
    set('v_pil', t('t_pil') ? (DES + 5) : DES);
    set('v_sob', t('t_sob') ? (SAB + " +V") : SAB);
    set('v_rel', t('t_rel') ? (SAB + 3) : SAB);
    set('v_int', t('t_int') ? (CAR + FOR) : CAR);
    set('v_sed', t('t_sed') ? (CAR + " +V") : CAR);
    set('v_lei', t('t_lei') ? (INT + 4) : INT);
    set('v_dom', t('t_dom') ? (CAR + SAB) : CAR);
    set('v_inv', t('t_inv') ? (PER + SAB) : PER);
    set('v_von', t('t_von') ? (CON + INT) : CON); // Vontade

    // --- SALVAMENTO AUTOMÁTICO ---
    // Adicionado o 'select' na busca para salvar Raça e Classe também
    const todosInputs = document.querySelectorAll('input, textarea, select');
    const dadosParaSalvar = {};
    todosInputs.forEach(input => {
        if (input.id) {
            dadosParaSalvar[input.id] = input.type === "checkbox" ? input.checked : input.value;
        }
    });
    localStorage.setItem('dadosFichaNebula', JSON.stringify(dadosParaSalvar));
}

window.onload = carregarFicha;