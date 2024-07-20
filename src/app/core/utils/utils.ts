export const transformName = (fullName: string) => {
  let names = fullName.split(' ');
  let firstName =
    names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase();
  let lastName =
    names[1].charAt(0).toUpperCase() + names[1].slice(1).toLowerCase();
  let transformedName = `${lastName}, ${firstName}`;
  return transformedName;
};
