import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* <SocketProvider /> */}
      <RouterProvider router={router} />
      {/* </SmoothScroll> */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            zIndex: 9999999999,
          },
        }}
      />
    </PersistGate>
  </Provider>,
);
