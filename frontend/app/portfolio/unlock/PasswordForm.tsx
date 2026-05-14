'use client'

import {useState} from 'react'
import {useFormStatus} from 'react-dom'

import {unlockPortfolio} from '@/app/portfolio/actions'

function EyeOpenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
      <path d="M6 1a5 5 0 0 1 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SubmitButton() {
  const {pending} = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-mono text-xs tracking-widest uppercase px-6 py-3.5 rounded transition-colors hover:bg-gray-700 dark:hover:bg-gray-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      {pending ? (
        <>
          <Spinner />
          Verifying
        </>
      ) : (
        'Unlock'
      )}
    </button>
  )
}

type Props = {
  from: string
  hasError: boolean
}

export default function PasswordForm({from, hasError}: Props) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={unlockPortfolio} noValidate>
      <input type="hidden" name="from" value={from} />

      <div className={hasError ? 'animate-shake' : ''}>
        <div className="flex items-baseline justify-between mb-2">
          <label
            htmlFor="password"
            className="font-mono text-xs tracking-widest uppercase text-gray-400 dark:text-gray-600"
          >
            Password
          </label>
          {hasError && (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase text-red-500 dark:text-red-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 shrink-0" aria-hidden="true" />
              Incorrect
            </span>
          )}
        </div>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            required
            className="w-full bg-transparent border border-gray-200 dark:border-gray-800 rounded px-4 py-3 pr-11 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:outline-none focus:border-brand dark:focus:border-brand transition-colors duration-150"
            placeholder="············"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded p-0.5"
          >
            {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
          </button>
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
