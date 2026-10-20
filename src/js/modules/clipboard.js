export function initClipboard() {
  const button = document.querySelector('[data-copy-handle]');
  const status = document.querySelector('[data-copy-status]');
  if (!button || !status) return;

  button.addEventListener('click', async () => {
    const value = button.dataset.copyValue;
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      status.textContent = 'Готово: @xasi88 скопирован в буфер обмена.';
    } catch {
      status.textContent = 'Не удалось скопировать автоматически. Скопируйте @xasi88 вручную.';
    }
  });
}
