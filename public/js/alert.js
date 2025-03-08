//type is 'success' or 'error'
export const hideAlert = () => {
  const el = document.querySelector(`.alert`);
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, mssg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${mssg}</div>`;
  document.querySelector(`body`).insertAdjacentHTML(`afterbegin`, markup);
  window.setTimeout(hideAlert, 5000);
};
