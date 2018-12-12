module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? options.enabled: false

  return {
    test: () => window.calq,
    track: (eventName, eventProperties) => {
      if (window.calq && eventName)
        calq.action.track(eventName, eventProperties)
    },
    identify: (userId, userProperties) => {
      if (window.calq) calq.user.identify(userId)

      if (window.calq && userProperties) {
        if (userProperties.email) userProperties.$email = userProperties.email
        if (userProperties.phone) userProperties.$phone = userProperties.phone

        delete userProperties.email
        delete userProperties.phone

        if (userProperties.city) userProperties.$city = userProperties.city
        if (userProperties.country) userProperties.$country = userProperties.country
        if (userProperties.region) userProperties.$region = userProperties.region
        if (userProperties.full_name) userProperties.$full_name = userProperties.full_name

        delete userProperties.city
        delete userProperties.country
        delete userProperties.region
        delete userProperties.full_name

        if (userProperties.utm_campaign) userProperties.$utm_campaign = userProperties.utm_campaign
        if (userProperties.utm_source) userProperties.$utm_source = userProperties.utm_source
        if (userProperties.utm_medium) userProperties.$utm_medium = userProperties.utm_medium
        if (userProperties.utm_content) userProperties.$utm_content = userProperties.utm_content
        if (userProperties.utm_term) userProperties.$utm_term = userProperties.utm_term

        delete userProperties.utm_campaign
        delete userProperties.utm_source
        delete userProperties.utm_medium
        delete userProperties.utm_content
        delete userProperties.utm_term

        calq.user.profile(userProperties)
      }
    },
    page: (category, name, properties) => {
      if (window.calq) calq.action.trackPageView()
    },

    isEnabled: () => enabled,
  }
}