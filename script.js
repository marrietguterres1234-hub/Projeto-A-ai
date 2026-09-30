
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const section = document.querySelector(link.getAttribute('href'));

      if (!section) return;

      event.preventDefault();
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });

  const sections = document.querySelectorAll('section[id], footer[id]');

  const updateActiveLink = () => {
    const currentSection = Array.from(sections).find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 140 && rect.bottom > 140;
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        'ativo',
        currentSection &&
          link.getAttribute('href') === `#${currentSection.id}`
      );
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  const shareButtons = document.querySelectorAll('[data-share-site]');

  shareButtons.forEach((shareButton) => shareButton.addEventListener('click', async () => {
    const shareData = {
      title: 'Mania de Açaí',
      text: 'Confira o cardápio da Mania de Açaí!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);

      const originalText = shareButton.textContent;
      shareButton.textContent = 'Link copiado!';

      setTimeout(() => {
        shareButton.textContent = originalText;
      }, 2000);
    } catch (error) {
      if (error.name !== 'AbortError') {
        window.prompt(
          'Copie o link do cardápio:',
          window.location.href
        );
      }
    }
  }));

  document.querySelectorAll('.adicionais').forEach((seletor) => {
    const limite = Number(seletor.dataset.limite);
    const opcoes = [...seletor.querySelectorAll('input[type="checkbox"]')];
    const aviso = seletor.querySelector('.aviso-adicionais');

    const atualizarOpcoes = () => {
      const selecionadas = opcoes.filter((opcao) => opcao.checked).length;
      const limiteAtingido = selecionadas >= limite;

      opcoes.forEach((opcao) => {
        opcao.disabled = limiteAtingido && !opcao.checked;
      });

      aviso.textContent = `${selecionadas} de ${limite} adicionais selecionados.${limiteAtingido ? ' Limite atingido. Desmarque uma opção para trocar.' : ''}`;
    };

    opcoes.forEach((opcao) => opcao.addEventListener('change', atualizarOpcoes));
    atualizarOpcoes();
  });

  document.querySelector('#editar-pedido').addEventListener('click', () => document.querySelector('#resumo-pedido').close());
  document.querySelectorAll('button.btn-pedir-copo').forEach((botao) => {
    botao.addEventListener('click', () => {
      const card = botao.closest('.card-produto');
      const seletor = card.querySelector('.adicionais');
      const adicionais = [...seletor.querySelectorAll('input:checked')]
        .map((opcao) => opcao.value)
        .join(', ') || 'sem adicionais';
      const quantidade = seletor.querySelectorAll('input:checked').length;
      if (quantidade > Number(seletor.dataset.limite)) {
        seletor.querySelector('.aviso-adicionais').textContent = 'Reduza os adicionais ao limite do copo.';
        return;
      }
      const preco = card.querySelector('.preco').textContent.trim();
      const mensagem = `Olá! Quero pedir:\n${seletor.dataset.copo}\nAdicionais: ${adicionais}\nValor do copo: ${preco}\nPode confirmar disponibilidade, entrega e pagamento?`;
      document.querySelector('#texto-resumo').textContent = `${seletor.dataset.copo}\nAdicionais: ${adicionais}\nValor do copo: ${preco}`;
      document.querySelector('#enviar-pedido').href = `https://wa.me/5551989639547?text=${encodeURIComponent(mensagem)}`;
      document.querySelector('#resumo-pedido').showModal();
    });
  });
});
