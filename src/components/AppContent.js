import React, { Suspense, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { useSelector } from 'react-redux'

// routes config
import routes from '../routes'

const AppContent = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  useEffect(() => {
    console.log(isAuthenticated)
  }, [isAuthenticated])

  return !isAuthenticated ? (
    <Redirect to="/login" />
  ) : (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Switch>
          {routes.map((route, idx) => {
            return (
              route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={(props) => (
                    <>
                      <route.component {...props} />
                    </>
                  )}
                />
              )
            )
          })}
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
