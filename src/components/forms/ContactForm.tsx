/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { Icon } from '@iconify/react';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { z } from 'zod';
import type { TurnstileStatus } from '@/components';
import { TurnstileWidget, Button, Input, Label, Textarea } from '@/components';

interface ContactFormProps {
	turnstileSiteKey?: string;
	turnstileBypass?: boolean;
}

export function ContactForm({
	turnstileSiteKey,
	turnstileBypass,
}: ContactFormProps) {
	const [submitted, setSubmitted] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
	const [turnstileStatus, setTurnstileStatus] =
		useState<TurnstileStatus>('idle');

	const contactSchema = z.object({
		name: z.string().trim().min(1, 'Name required'),
		email: z.string().trim().min(1, 'Email required').email('Invalid email'),
		subject: z.string().trim().min(1, 'Subject required'),
		message: z.string().trim().min(10, 'Min 10 chars'),
		turnstileToken: z.string().optional(),
	});

	const form = useForm({
		defaultValues: {
			name: '',
			email: '',
			subject: '',
			message: '',
			turnstileToken: '',
		},
		onSubmit: async ({ value, formApi }) => {
			const parsed = contactSchema.safeParse(value);
			if (!parsed.success) {
				setErrorMsg(parsed.error.issues[0]?.message || 'Validation error');
				return;
			}
			setErrorMsg(null);
			try {
				const payload = { ...value, turnstileToken: turnstileToken || '' };
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
						return;
					}
					setErrorMsg(data?.error || `Error ${res.status}`);
					return;
				}
				setSubmitted(true);
				// Fire a custom event so a global toast handler can listen
				window.dispatchEvent(
					new CustomEvent('contact:success', { detail: { name: value.name } }),
				);
				setTimeout(() => setSubmitted(false), 5000);
				formApi.reset();
				setTurnstileToken(null);
			} catch (err) {
				console.error(err);
				setErrorMsg('Failed to send message. Please try again later.');
			}
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="relative space-y-10"
			noValidate
		>
			<div className="grid md:grid-cols-2 gap-8">
				<form.Field
					name="name"
					validators={{
						onChange: ({ value }) => {
							const r = contactSchema.shape.name.safeParse(value);
							return r.success ? undefined : r.error.issues[0].message;
						},
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2">
							<Label htmlFor={field.name} className="flex items-center gap-2">
								Name
							</Label>
							<Input
								id={field.name}
								value={field.state.value}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									field.handleChange(e.target.value)
								}
								onBlur={field.handleBlur}
								placeholder="Your name"
								aria-invalid={field.state.meta.errors.length > 0}
							/>
							{field.state.meta.errors[0] && (
								<p className="text-xs text-rose-500 flex items-center gap-1">
									<Icon icon="line-md:alert-circle" />{' '}
									{field.state.meta.errors[0]}
								</p>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="email"
					validators={{
						onChange: ({ value }) => {
							const r = contactSchema.shape.email.safeParse(value);
							return r.success ? undefined : r.error.issues[0].message;
						},
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2">
							<Label htmlFor={field.name}>Email</Label>
							<Input
								id={field.name}
								type="email"
								value={field.state.value}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									field.handleChange(e.target.value)
								}
								onBlur={field.handleBlur}
								placeholder="you@example.com"
								aria-invalid={field.state.meta.errors.length > 0}
							/>
							{field.state.meta.errors[0] && (
								<p className="text-xs text-rose-500 flex items-center gap-1">
									<Icon icon="line-md:alert-circle" />{' '}
									{field.state.meta.errors[0]}
								</p>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="subject"
					validators={{
						onChange: ({ value }) => {
							const r = contactSchema.shape.subject.safeParse(value);
							return r.success ? undefined : r.error.issues[0].message;
						},
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2 md:col-span-2">
							<Label htmlFor={field.name}>Subject</Label>
							<Input
								id={field.name}
								value={field.state.value}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									field.handleChange(e.target.value)
								}
								onBlur={field.handleBlur}
								placeholder="What is this about?"
								aria-invalid={field.state.meta.errors.length > 0}
							/>
							{field.state.meta.errors[0] && (
								<p className="text-xs text-rose-500 flex items-center gap-1">
									<Icon icon="line-md:alert-circle" />{' '}
									{field.state.meta.errors[0]}
								</p>
							)}
						</div>
					)}
				</form.Field>
			</div>

			<form.Field
				name="message"
				validators={{
					onChange: ({ value }) => {
						const r = contactSchema.shape.message.safeParse(value);
						return r.success ? undefined : r.error.issues[0].message;
					},
				}}
			>
				{(field) => (
					<div className="flex flex-col gap-2">
						<Label htmlFor={field.name}>Message</Label>
						<Textarea
							id={field.name}
							rows={7}
							value={field.state.value}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
								field.handleChange(e.target.value)
							}
							onBlur={field.handleBlur}
							placeholder="Tell me what's on your mind..."
							aria-invalid={field.state.meta.errors.length > 0}
						/>
						{field.state.meta.errors[0] && (
							<p className="text-xs text-rose-500 flex items-center gap-1">
								<Icon icon="line-md:alert-circle" />{' '}
								{field.state.meta.errors[0]}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<div className="flex flex-wrap items-center gap-5">
				<Button
					type="submit"
					disabled={Boolean(
						!form.state.canSubmit ||
							form.state.isSubmitting ||
							(turnstileSiteKey &&
								!turnstileBypass &&
								turnstileStatus === 'rendered' &&
								!turnstileToken),
					)}
					className="min-w-40 relative"
				>
					{form.state.isSubmitting && (
						<Icon
							icon="line-md:loading-twotone-loop"
							className="absolute left-4 text-xl"
						/>
					)}
					<span className={form.state.isSubmitting ? 'opacity-60' : ''}>
						{form.state.isSubmitting ? 'Sending' : 'Send Message'}
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
				/>
				{/* Success toast now handled globally */}
				{errorMsg && (
					<span className="inline-flex items-center gap-2 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 px-4 py-1.5 text-sm font-medium border border-rose-500/30 animate-in fade-in max-w-full">
						<Icon icon="line-md:alert" className="text-lg" /> {errorMsg}
					</span>
				)}
				<div className="text-xs opacity-60" aria-live="polite">
					{!submitted &&
						form.state.isSubmitted &&
						!form.state.isSubmitting &&
						!form.state.canSubmit &&
						'Please fix the errors above.'}
				</div>
			</div>
		</form>
	);
}
