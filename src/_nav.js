export default {
  items: [
    {
      title: true,
      name: 'My Bundles',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Saved',
      url: '/reqlist/saved',
      icon: 'fa fa-save',
    },
    {
      name: 'In Progress',
      url: '/reqlist/inprogress',
      icon: 'fa fa-spinner',
    },
    {
      name: 'Completed',
      url: '/reqlist/completed',
      icon: 'fa fa-check-square-o',
    },
    {
      name: 'Withdrawn',
      url: '/reqlist/withdrawn',
      icon: 'fa fa-trash',
    },
    {
      title: true,
      name: 'My actions',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'My Worklist',
      url: '/reqlist/worklist',
      icon: 'fa fa-list-ul',
    },
    {
      name: 'Handled Worklist',
      url: '/reqlist/handled',
      icon: 'fa fa-check-square-o',
    },
  ],
};
