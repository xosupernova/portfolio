/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { z } from 'zod';
import type { TurnstileStatus } from '@/components';
import { Button, Input, Label, Textarea, TurnstileWidget } from '@/components';

interface ContactFormProps {
	turnstileSiteKey?: string;
	turnstileBypass?: boolean;
}

// Schema for final submit validation
const contactSchema = z.object({
	name: z.string().trim().min(1, 'Name required'),
	email: z.string().trim().min(1, 'Email required').email('Invalid email'),
	subject: z.string().trim().min(1, 'Subject required'),
	message: z.string().trim().min(10, 'Min 10 chars'),
});

type Values = z.infer<typeof contactSchema>;
type Errors = Partial<Record<keyof Values, string>>;

export function ContactForm({
	turnstileSiteKey,
	turnstileBypass,
}: ContactFormProps) {
	const [values, setValues] = useState<Values>({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [errors, setErrors] = useState<Errors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
	const [turnstileStatus, setTurnstileStatus] =
		useState<TurnstileStatus>('idle');

	const validateField = (
		name: keyof Values,
		value: string,
	): string | undefined => {
		switch (name) {
			case 'name':
				return value.trim().length === 0 ? 'Name required' : undefined;
			case 'email':
				if (value.trim().length === 0) return 'Email required';
				return /.+@.+\..+/.test(value) ? undefined : 'Invalid email';
			case 'subject':
				return value.trim().length === 0 ? 'Subject required' : undefined;
			case 'message':
				return value.trim().length < 10 ? 'Min 10 chars' : undefined;
		}
	};

	const handleChange = (field: keyof Values) => (value: string) => {
		setValues((v) => ({ ...v, [field]: value }));
		const err = validateField(field, value);
		setErrors((e) => ({ ...e, [field]: err }));
	};

	const canSubmit =
		Object.values(values).every((v) => v.trim().length > 0) &&
		Object.values(errors).every((e) => !e);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsSubmitted(true);
		const parsed = contactSchema.safeParse(values);
		if (!parsed.success) {
			const first = parsed.error.issues[0];
			setErrorMsg(first?.message || 'Validation error');
			// map zod errors into field errors
			const fieldErrors: Errors = {};
			for (const issue of parsed.error.issues) {
				const k = issue.path[0];
				if (typeof k === 'string')
					fieldErrors[k as keyof Values] = issue.message;
			}
			setErrors((prev) => ({ ...prev, ...fieldErrors }));
			return;
		}

		if (
			turnstileSiteKey &&
			!turnstileBypass &&
			turnstileStatus === 'rendered' &&
			!turnstileToken
		) {
			setErrorMsg('Please complete the Turnstile challenge.');
			return;
		}

		setErrorMsg(null);
		setIsSubmitting(true);
		try {
			const payload = { ...values, turnstileToken: turnstileToken || '' };
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => null);
				if (res.status === 429 && data?.retryAfter) {
					setErrorMsg(
						`Rate limited. Please wait ${data.retryAfter}s before retrying.`,
					);
				} else {
					setErrorMsg(data?.error || `Error ${res.status}`);
				}
				return;
			}
			// success
			window.dispatchEvent(
				new CustomEvent('contact:success', { detail: { name: values.name } }),
			);
			setValues({ name: '', email: '', subject: '', message: '' });
			setErrors({});
			setTurnstileToken(null);
		} catch (err) {
			console.error(err);
			setErrorMsg('Failed to send message. Please try again later.');
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className="relative space-y-10" noValidate>
			<div className="grid md:grid-cols-2 gap-8">
				<div className="flex flex-col gap-2">
					<Label htmlFor="name" className="flex items-center gap-2">
						Name
					</Label>
					<Input
						id="name"
						value={values.name}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							handleChange('name')(e.target.value)
						}
						placeholder="Your name"
						aria-invalid={Boolean(errors.name)}
					/>
					{errors.name && (
						<p className="text-xs text-rose-500 flex items-center gap-1">
							<Icon icon="line-md:alert-circle" /> {errors.name}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						value={values.email}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							handleChange('email')(e.target.value)
						}
						placeholder="you@example.com"
						aria-invalid={Boolean(errors.email)}
					/>
					{errors.email && (
						<p className="text-xs text-rose-500 flex items-center gap-1">
							<Icon icon="line-md:alert-circle" /> {errors.email}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2 md:col-span-2">
					<Label htmlFor="subject">Subject</Label>
					<Input
						id="subject"
						value={values.subject}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							handleChange('subject')(e.target.value)
						}
						placeholder="What is this about?"
						aria-invalid={Boolean(errors.subject)}
					/>
					{errors.subject && (
						<p className="text-xs text-rose-500 flex items-center gap-1">
							<Icon icon="line-md:alert-circle" /> {errors.subject}
						</p>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="message">Message</Label>
				<Textarea
					id="message"
					rows={7}
					value={values.message}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
						handleChange('message')(e.target.value)
					}
					placeholder="Tell me what's on your mind..."
					aria-invalid={Boolean(errors.message)}
				/>
				{errors.message && (
					<p className="text-xs text-rose-500 flex items-center gap-1">
						<Icon icon="line-md:alert-circle" /> {errors.message}
					</p>
				)}
			</div>

			<div className="flex flex-wrap items-center gap-5">
				<Button
					type="submit"
					disabled={
						!canSubmit ||
						isSubmitting ||
						Boolean(
							turnstileSiteKey &&
								!turnstileBypass &&
								turnstileStatus === 'rendered' &&
								!turnstileToken,
						)
					}
					className="min-w-40 relative"
				>
					{isSubmitting && (
						<Icon
							icon="line-md:loading-twotone-loop"
							className="absolute left-4 text-xl"
						/>
					)}
					<span className={isSubmitting ? 'opacity-60' : ''}>
						{isSubmitting ? 'Sending' : 'Send Message'}
					</span>
				</Button>
				<TurnstileWidget
					siteKey={turnstileSiteKey}
					bypass={turnstileBypass}
					status={turnstileStatus}
					setStatus={setTurnstileStatus}
					token={turnstileToken}
					setToken={setTurnstileToken}
					className="w-full space-y-1"
					localFallback={!turnstileSiteKey}
				/>
				{errorMsg && (
					<span className="inline-flex items-center gap-2 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 px-4 py-1.5 text-sm font-medium border border-rose-500/30 animate-in fade-in max-w-full">
						<Icon icon="line-md:alert" className="text-lg" /> {errorMsg}
					</span>
				)}
				<div className="text-xs opacity-60" aria-live="polite">
					{!isSubmitted &&
						isSubmitted &&
						!isSubmitting &&
						!canSubmit &&
						'Please fix the errors above.'}
				</div>
			</div>
		</form>
	);
}
