import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { AsyncStorage } from 'react-native'
import { persistStore, persistReducer } from 'redux-persist';

import rootReducer from './reducers'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['currentUser']
  };

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
    persistedReducer,
    applyMiddleware(thunk)
)

const persistor = persistStore(store)

export {
    store,
    persistor,
}