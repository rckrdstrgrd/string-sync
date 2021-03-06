import React from 'react';
import { createSink } from 'recompose';

import notification from 'antd/lib/notification';

const installNotificationSystem = () => {
  notification.config({ duration: 3 });
  window.notification = notification;
};

export default createSink(installNotificationSystem);
