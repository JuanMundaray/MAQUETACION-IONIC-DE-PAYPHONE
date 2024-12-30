// configurations.d.ts
export const configurationsId = {
  rootElement: 'id_component', // DOM Element that will contains the HTML Component
  timeouts: {
    front: 300000,
    back: 300000,
  },
  captureMode: {
    front: {
      enabled: true,
      after: 60000,
    },
    back: {
      enabled: true,
      after: 60000,
    },
  },
  // Enable/Disable image guide
  guide: {
    front: {
      enabled: true, //Enable guide on front capture. (By default is enabled)
      until: 150000, // wait for 10 seconds to hide the image
    },
    back: {
      enabled: true, //Enable guide on back capture. (By default is enabled)
      until: 150000, // wait for 10 seconds to hide the image
    },
  },
  autorotate: true, //Automatic rotate the image to return a landscape image.
  antispoofing: {
    // Default values
    enabled: false,
    //level: 3,
  },
};

export const configurationsFace = {
  rootElement: 'id_component', // DOM Element that will contains the HTML Component
  maxValidations: 3,
  features: {
    // Optional
    disabled: ['glasses', 'facemask'], //Default values // Does not allow glasses and facemask
    enabled: [],
  },
  antispoofing: {
    // Default values
    enabled: true,
    level: 3,
  },
};
