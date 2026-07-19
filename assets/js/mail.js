document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("feedback-form");
        const submitBtn = form.querySelector(".feedback-form__submit");

        form.addEventListener("submit", async function (e) {
          e.preventDefault();

          submitBtn.disabled = true;
          const originalText = submitBtn.textContent;
          submitBtn.textContent = "Отправка...";

          const formData = new FormData(form);

          try {
            const response = await fetch(form.action || "send.php", {
              method: "POST",
              body: formData,
            });

            const data = await response.json().catch(() => null);

            if (response.ok && data && data.status === "success") {
              alert("Сообщение успешно отправлено!");
              form.reset();
            } else {
              alert((data && data.message) || "Ошибка при отправке.");
            }
          } catch (err) {
            alert("Ошибка сети. Попробуйте позже.");
          } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        });
      });
