/* ===================================================
   SCRIPT DA APOSTILA — SEMANA 10 (refatorado)
   - Dom Ready
   - Zero inline CSS / sem style embutido
   - A11y melhorado (aria-pressed, role, tabindex)
   - Evita NPE com checagens defensivas
   - Reuso de utilitários
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ========= Utilitários =========
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const appendLog = (el, msg) => {
    if (!el) return;
    const ts = new Date().toLocaleTimeString();
    el.textContent += `[${ts}] ${msg}\n`;
    el.scrollTop = el.scrollHeight;
  };

  // ========= 2. DOM & Seletores =========
  (() => {
    const p = $('#ex-dom-texto');
    const byId = $('#ex-dom-btn-id');
    const byQuery = $('#ex-dom-btn-query');

    if (p && byId) {
      byId.addEventListener('click', () => {
        p.textContent = 'Texto alterado via getElementById!';
      });
    }
    if (byQuery) {
      byQuery.addEventListener('click', () => {
        const el = document.querySelector('#ex-dom-texto');
        if (el) el.textContent = 'Texto alterado via querySelector!';
      });
    }
  })();

  // ========= 3. addEventListener (múltiplos) =========
  (() => {
    const btn = $('#ex-multi-listener-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      btn.textContent = 'Texto alterado (Listener 1)';
    });

    // Segundo listener mantém o primeiro (boa prática com addEventListener)
    btn.addEventListener('click', () => {
      console.log('Botão multi-listener clicado (Listener 2)');
    });
  })();

  // ========= 4. Ciclo do evento: target/currentTarget, stopPropagation =========
  (() => {
    const pai  = $('#ex-ciclo-pai');
    const filho = $('#ex-ciclo-filho');
    const stopBtn = $('#ex-ciclo-stop-btn');
    const logEl = $('#ex-ciclo-log');

    if (!pai || !filho || !stopBtn) return;

    pai.addEventListener('click', (e) => {
      appendLog(logEl, `PAI clicado — target: <${e.target.tagName.toLowerCase()}> | currentTarget: #${e.currentTarget.id}`);
    });

    filho.addEventListener('click', (e) => {
      appendLog(logEl, `FILHO clicado — target: <${e.target.tagName.toLowerCase()}> | currentTarget: #${e.currentTarget.id}`);
    });

    stopBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // interrompe bubbling
      appendLog(logEl, 'BOTÃO clicado — stopPropagation() chamado');
    });
  })();

  // ========= 5. Catálogo de eventos =========
  (() => {
    const input = $('#ex-catalogo-input');
    const hover = $('#ex-catalogo-hover');
    const logSpan = $('#ex-catalogo-log');

    const setMsg = (msg) => { if (logSpan) logSpan.textContent = msg; };

    if (input) {
      input.addEventListener('focus', () => setMsg('Evento: focus'));
      input.addEventListener('blur', () => setMsg('Evento: blur'));
      input.addEventListener('keydown', (e) => setMsg(`Evento: keydown (Tecla: ${e.key})`));
      input.addEventListener('input', (e) => setMsg(`Evento: input (Valor: ${e.target.value})`));
    }
    if (hover) {
      hover.addEventListener('mouseenter', () => setMsg('Evento: mouseenter'));
      hover.addEventListener('mouseleave', () => setMsg('Evento: mouseleave'));
    }
  })();

  // ========= 6. classList + textContent/innerHTML =========
  (() => {
    // Toggle de estado (sem depender de CSS adicional)
    const status = $('#ex-tema-status');
    const toggleBtn = $('#ex-tema-btn');

    if (toggleBtn && status) {
      toggleBtn.addEventListener('click', () => {
        const pressed = toggleBtn.getAttribute('aria-pressed') === 'true';
        toggleBtn.setAttribute('aria-pressed', String(!pressed));
        document.body.classList.toggle('ativo'); // classe genérica existente no seu CSS
        status.textContent = document.body.classList.contains('ativo') ? 'Modo: Ativo' : 'Modo: Normal';
      });
    }

    // textContent × innerHTML
    const inEl = $('#ex-xss-input');
    const outEl = $('#ex-xss-output');
    const btnText = $('#ex-xss-btn-text');
    const btnHtml = $('#ex-xss-btn-html');

    if (inEl && outEl && btnText && btnHtml) {
      btnText.addEventListener('click', () => {
        outEl.textContent = inEl.value; // Seguro
      });
      btnHtml.addEventListener('click', () => {
        // Demonstração do risco: interpreta HTML (NÃO faça isso com entrada do usuário!)
        outEl.innerHTML = inEl.value;
      });
    }
  })();

  // ========= 8. Boas práticas: this & A11y =========
  (() => {
    const btnTrad = $('#ex-this-trad');
    const btnArrow = $('#ex-this-arrow');
    const divBtn = $('#ex-a11y-btn');

    if (btnTrad) {
      btnTrad.addEventListener('click', function () {
        console.log('Função TRADICIONAL — this:', this); // o próprio botão
        this.textContent = 'this é o botão';
      });
    }
    if (btnArrow) {
      btnArrow.addEventListener('click', (e) => {
        console.log('ARROW — this:', this); // window (léxico)
        e.currentTarget.textContent = 'use currentTarget';
      });
    }
    if (divBtn) {
      const toggle = (e) => {
        const active = divBtn.getAttribute('aria-pressed') === 'true';
        divBtn.setAttribute('aria-pressed', String(!active));
        divBtn.classList.toggle('exemplo-ativo');
        console.log(`Ativado via ${e.type}`);
      };
      divBtn.addEventListener('click', toggle);
      divBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(e);
        }
      });
    }
  })();

  // ========= 9. Delegação =========
  (() => {
    const ul = $('#deleg-lista');
    const addBtn = $('#ex-deleg-add-btn');
    const input = $('#ex-deleg-input');

    if (!ul || !addBtn || !input) return;

    // Listener no PAI
    ul.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-acao="remover"]');
      if (!btn) return;
      const li = btn.closest('li');
      if (li) li.remove();
    });

    const add = () => {
      const txt = input.value.trim();
      if (!txt) return;
      const li = document.createElement('li');
      // Aqui controlamos 100% do HTML gerado
      li.innerHTML = `<span>${txt} (Novo)</span>
        <button class="delete-btn" data-acao="remover" type="button">Remover</button>`;
      ul.appendChild(li);
      input.value = '';
      input.focus();
    };

    addBtn.addEventListener('click', add);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); add(); }
    });
  })();

  // ========= 10. Formulário (estudo de caso) =========
  (() => {
    const form = $('#form-contato');
    if (!form) return;

    const msg = $('#mensagem-feedback');
    const nome = $('#nome');
    const email = $('#email');

    const clear = () => {
      if (msg) { msg.textContent = ''; msg.className = 'mensagem'; }
      nome?.removeAttribute('data-erro');
      email?.removeAttribute('data-erro');
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clear();

      const vNome = (nome?.value || '').trim();
      const vEmail = (email?.value || '').trim();

      const okNome  = vNome.length >= 3;
      const okEmail = vEmail.includes('@') && vEmail.includes('.');

      if (!okNome || !okEmail) {
        if (msg) { msg.textContent = 'Preencha os campos corretamente.'; msg.classList.add('erro'); }
        if (!okNome)  nome?.setAttribute('data-erro', 'true');
        if (!okEmail) email?.setAttribute('data-erro', 'true');
        (!okNome ? nome : email)?.focus();
        return;
      }

      if (msg) { msg.textContent = `Obrigado, ${vNome}! Cadastro recebido com sucesso.`; msg.classList.add('sucesso'); }
      form.reset();
      nome?.focus();
    });
  })();

  // ========= Scrollspy (navegação lateral ativa) =========
  (() => {
    const sections = $$('.content-section');
    const links = $$('.sidebar-nav .nav-link');
    if (!sections.length || !links.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        links.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      });
    }, { root: null, rootMargin: '0px 0px -40% 0px', threshold: 0.1 });

    sections.forEach((sec) => io.observe(sec));
  })();

  // ========= Prism =========
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
});
