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
      nationalMode: false,
      strictMode: true,
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

  function formatRussianPhone() {
    let digits = phoneInput.value.replace(/\D/g, "");

    if (digits.startsWith("7") || digits.startsWith("8")) {
      digits = digits.slice(1);
    }
    digits = digits.slice(0, 10);

    let formatted = "+7";
    if (digits.length > 0) formatted += " (" + digits.slice(0, 3);
    if (digits.length >= 3) formatted += ") " + digits.slice(3, 6);
    if (digits.length >= 6) formatted += "-" + digits.slice(6, 8);
    if (digits.length >= 8) formatted += "-" + digits.slice(8, 10);
    phoneInput.value = formatted;
  }

  if (phoneInput) {
    phoneInput.addEventListener("focus", function () {
      if (phoneInput.value.trim() === "") {
        phoneInput.value = "+7";
      }
    });
    phoneInput.addEventListener("input", formatRussianPhone);
  }

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
