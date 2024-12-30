import { Option } from "./configAdmin";

let OptionesSelect = Option;

export const buttonsConfig = [
    {
      permission: 'admcontries',
      icon: 'bi-globe',
      label: 'Paises',
      optionSelect: OptionesSelect.Contries,
    },
    {
      permission: 'admcompanies',
      icon: 'bi-person-workspace',
      label: 'Empresas',
      optionSelect: OptionesSelect.Companies,
    },
    {
      permission: 'admadm',
      icon: 'bi-person-badge',
      label: 'Admins',
      optionSelect: OptionesSelect.Admins,
    },
    {
      permission: 'admsocios',
      icon: 'bi-people',
      label: 'Socios',
      optionSelect: OptionesSelect.UsuariosSocios,
    },
    {
      permission: 'asesores',
      icon: 'bi-chat-dots',
      label: 'Asesores',
      optionSelect: OptionesSelect.UsuariosAsesor,
    },
    {
      permission: 'admbackoffice',
      icon: 'bi-person-lines-fill',
      label: 'Backoffice',
      optionSelect: OptionesSelect.UsuariosBackoffice,
    },
    {
      permission: 'admusroles',
      icon: 'bi-person-check',
      label: 'Usuarios Roles',
      optionSelect: OptionesSelect.UsuariosRoles,
    },
    {
      permission: 'admsesion',
      icon: 'bi-x-octagon-fill',
      label: 'Sesiones',
      optionSelect: OptionesSelect.Sesiones,
    },
    {
      permission: 'admsesion',
      icon: 'bi-building',
      label: 'Sucursales',
      optionSelect: OptionesSelect.Sucursales,
    }
  ];