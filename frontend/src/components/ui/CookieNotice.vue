<template>
<div class="cookie-notice js-cookie-notice"
     hidden
     role="dialog"
     aria-modal="true"
     aria-labelledby="cookie-notice-title"
     aria-describedby="cookie-notice-description"
     tabindex="-1">
    <div class="cookie-notice__main">
        <h2 class="cookie-notice__title" id="cookie-notice-title">Настройки cookie</h2>
        <p class="cookie-notice__text" id="cookie-notice-description">
            Сайт использует необходимую cookie для защиты формы, а с вашего разрешения —
            Яндекс.Карты и Яндекс.Метрику. Необязательные сервисы можно разрешить или
            отключить отдельно. Подробнее — в
            <a href="/privacy-policy.html" target="_blank" rel="noopener">политике обработки персональных данных</a>.
        </p>
    </div>

    <div class="cookie-notice__settings js-cookie-settings" hidden>
        <div class="cookie-notice__option">
            <label class="cookie-notice__label">
                <input type="checkbox" checked disabled>
                <span>
                    <strong>Необходимые cookie</strong>
                    <small>Поддерживают защищённую сессию формы обратной связи. Отключить их средствами сайта нельзя.</small>
                </span>
            </label>
        </div>

        <div class="cookie-notice__option">
            <label class="cookie-notice__label">
                <input type="checkbox" class="js-cookie-functional">
                <span>
                    <strong>Функциональные cookie и запросы</strong>
                    <small>Разрешают загрузить интерактивную карту с серверов Яндекса.</small>
                </span>
            </label>
        </div>

        <div class="cookie-notice__option">
            <label class="cookie-notice__label">
                <input type="checkbox" class="js-cookie-analytics">
                <span>
                    <strong>Аналитические cookie</strong>
                    <small>Помогают оценивать посещаемость через Яндекс.Метрику. Вебвизор отключён.</small>
                </span>
            </label>
        </div>
    </div>

    <div class="cookie-notice__buttons">
        <button type="button" class="cookie-notice__button cookie-notice__button--secondary js-cookie-reject">
            Отклонить необязательные
        </button>
        <button type="button"
                class="cookie-notice__button cookie-notice__button--secondary js-cookie-toggle-settings"
                aria-expanded="false">
            Настроить
        </button>
        <button type="button"
                class="cookie-notice__button cookie-notice__button--secondary js-cookie-save"
                hidden>
            Сохранить настройки
        </button>
        <button type="button" class="cookie-notice__button cookie-notice__button--primary js-cookie-accept">
            Принять все
        </button>
    </div>
</div>
</template>
