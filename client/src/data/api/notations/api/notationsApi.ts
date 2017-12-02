const { $ } = window;

export const fetchNotations = (filters: any) => (
  $.ajax({
    method: 'GET',
    url: '/api/v1/notations',
    data: { filters }
  })
);