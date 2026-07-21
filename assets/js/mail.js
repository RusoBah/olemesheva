document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("feedback-form");

  if (!form) {
    return;
  }

  const submitButton = form.querySelector(".feedback-form__button");
  const submitLabel = form.querySelector(".feedback-form__submit");
  const status = form.querySelector(".feedback-form__status");
  const phoneInput = document.getElementById("feedback-phone");
  const csrfInput = form.elements.csrf_token;
  let phoneControl = null;
  let csrfRequest = null;

  if (phoneInput && typeof window.intlTelInput === "function") {
    phoneControl = window.intlTelInput(phoneInput, {
      initialCountry: "ru",
      onlyCountries: ["ru"],
      allowDropdown: false,
      nationalMode: false,
      strictMode: true,
      separateDialCode: true,
      formatAsYouType: true,
      loadUtils: function () {
        return import("https://cdn.jsdelivr.net/npm/intl-tel-input@26.8.1/build/js/utils.js");
      },
    });
  }

  function ensureCsrfToken() {
    if (csrfInput.value) {
      return Promise.resolve(csrfInput.value);
    }

    if (!csrfRequest) {
      csrfRequest = fetch("csrf.php", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      })
          .then(async function (response) {
            const data = await response.json().catch(function () {
              return null;
            });

            if (!response.ok || !data || data.status !== "success" || !data.csrfToken) {
              throw new Error("Не удалось подготовить форму. Обновите страницу.");
            }

            csrfInput.value = data.csrfToken;
            return data.csrfToken;
          })
          .finally(function () {
            csrfRequest = null;
          });
    }

    return csrfRequest;
  }

  ensureCsrfToken().catch(function (error) {
    status.textContent = error.message;
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    status.textContent = "";

    if (!form.reportValidity()) {
      return;
    }

    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    const originalMarkup = submitLabel.innerHTML;
    submitLabel.textContent = "Отправка...";

    try {
      await ensureCsrfToken();

      if (phoneControl) {
        phoneInput.value = phoneControl.getNumber() || phoneInput.value;
      }

      const response = await fetch(form.action || "send.php", {
        method: "POST",
        body: new FormData(form),
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const data = await response.json().catch(function () {
        return null;
      });

      if (!response.ok || !data || data.status !== "success") {
        throw new Error((data && data.message) || "Не удалось отправить сообщение.");
      }

      status.textContent = data.message || "Сообщение успешно отправлено.";
      form.reset();
      if (data.csrfToken) {
        form.elements.csrf_token.value = data.csrfToken;
      }
      if (phoneControl) {
        phoneControl.setCountry("ru");
      }
      phoneInput.value = "";
    } catch (error) {
      status.textContent = error.message || "Ошибка сети. Попробуйте позже.";
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      submitLabel.innerHTML = originalMarkup;
    }
  });
});
