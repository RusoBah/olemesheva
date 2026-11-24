import { ref, onMounted, onBeforeUnmount } from 'vue'

type FormResponse = { status?: string; message?: string; csrfToken?: string }

interface PhoneControl {
  getNumber(): string
  setCountry(country: string): void
  destroy(): void
}

type PhonePlugin = (input: HTMLInputElement, options: Record<string, unknown>) => PhoneControl

const headers = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
const phoneUtilsUrl = '/assets/vendor/intl-tel-input/js/utils.js'

async function readResponse(response: Response): Promise<FormResponse | null> {
  return response.json().catch(() => null)
}

export function useContactForm() {
  const phone = ref<HTMLInputElement | null>(null)
  const busy = ref(false)
  const status = ref('')
  let phoneControl: PhoneControl | undefined
  let csrfToken = ''
  let csrfRequest: Promise<string> | undefined

  function ensureCsrfToken() {
    if (csrfToken) return Promise.resolve(csrfToken)
    csrfRequest ??= fetch('/csrf.php', { credentials: 'same-origin', cache: 'no-store', headers })
      .then(async (response) => {
        const data = await readResponse(response)
        if (!response.ok || data?.status !== 'success' || !data.csrfToken) {
          throw new Error('Не удалось подготовить форму. Обновите страницу.')
        }
        return (csrfToken = data.csrfToken)
      })
      .finally(() => { csrfRequest = undefined })
    return csrfRequest
  }

  onMounted(() => {
    const intlTelInput = (window as Window & { intlTelInput?: PhonePlugin }).intlTelInput
    if (phone.value && intlTelInput) {
      phoneControl = intlTelInput(phone.value, {
        initialCountry: 'ru',
        onlyCountries: ['ru'],
        allowDropdown: false,
        nationalMode: false,
        strictMode: true,
        separateDialCode: true,
        formatAsYouType: true,
        loadUtils: () => import(/* @vite-ignore */ phoneUtilsUrl),
      })
    }
    ensureCsrfToken().catch(() => {
      if (!busy.value) status.value = 'Не удалось подготовить форму. Обновите страницу.'
    })
  })

  onBeforeUnmount(() => phoneControl?.destroy())

  async function submit(event: Event) {
    const form = event.currentTarget as HTMLFormElement
    if (busy.value) return
    status.value = ''
    if (!form.reportValidity()) return

    busy.value = true
    try {
      const token = await ensureCsrfToken()
      const body = new FormData(form)
      body.set('csrf_token', token)
      body.set('tel', phoneControl?.getNumber() || String(body.get('tel') ?? ''))
      const response = await fetch(form.action, { method: 'POST', body, credentials: 'same-origin', headers })
      const data = await readResponse(response)
      if (!response.ok || data?.status !== 'success') {
        if (response.status === 403) csrfToken = ''
        throw new Error(data?.message || 'Не удалось отправить сообщение.')
      }

      status.value = data.message || 'Сообщение успешно отправлено.'
      csrfToken = data.csrfToken || ''
      form.reset()
      phoneControl?.setCountry('ru')
      if (phone.value) phone.value.value = ''
    } catch (error) {
      status.value = error instanceof Error ? error.message : 'Ошибка сети. Попробуйте позже.'
    } finally {
      busy.value = false
    }
  }

  return { phone, busy, status, submit }
}
