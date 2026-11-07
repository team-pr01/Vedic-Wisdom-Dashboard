import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./providers/ChatProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
      <ChatProvider>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              zIndex: 9999999999,
            },
          }}
        />
      </PersistGate>
     </ChatProvider>
    </Provider>
 ,
);
