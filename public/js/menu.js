export const showMenu = (newMenu) => {
  if (newMenu.classList.contains(`active`)) {
    newMenu.classList.remove(`active`);
    newMenu.classList.add(`inactive`);
  } else {
    newMenu.classList.remove(`inactive`);
    newMenu.classList.add(`active`);
  }
};
