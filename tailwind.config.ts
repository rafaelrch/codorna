import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))',
  				light: 'hsl(var(--destructive-light))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))'
  			},
  			codorna: {
  				primary: 'var(--codorna-primary)',
  				'primary-hover': 'var(--codorna-primary-hover)',
  				'primary-light': 'var(--codorna-primary-light)',
  				'bg-primary': 'var(--codorna-bg-primary)',
  				'bg-secondary': 'var(--codorna-bg-secondary)',
  				'bg-tertiary': 'var(--codorna-bg-tertiary)',
  				'bg-sidebar': 'var(--codorna-bg-sidebar)',
  				'bg-card': 'var(--codorna-bg-card)',
  				'bg-hover': 'var(--codorna-bg-hover)',
  				'text-primary': 'var(--codorna-text-primary)',
  				'text-secondary': 'var(--codorna-text-secondary)',
  				'text-tertiary': 'var(--codorna-text-tertiary)',
  				'text-disabled': 'var(--codorna-text-disabled)',
  				'text-white': 'var(--codorna-text-white)',
  				'border-light': 'var(--codorna-border-light)',
  				'border-medium': 'var(--codorna-border-medium)',
  				'border-dark': 'var(--codorna-border-dark)',
  				success: 'var(--codorna-success)',
  				'success-bg': 'var(--codorna-success-bg)',
  				error: 'var(--codorna-error)',
  				'error-bg': 'var(--codorna-error-bg)',
  				warning: 'var(--codorna-warning)',
  				'warning-bg': 'var(--codorna-warning-bg)',
  				info: 'var(--codorna-info)',
  				'info-bg': 'var(--codorna-info-bg)'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))',
  				light: 'hsl(var(--success-light))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))',
  				light: 'hsl(var(--warning-light))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))',
  				'6': 'hsl(var(--chart-6))',
  				'7': 'hsl(var(--chart-7))',
  				aluguel: 'var(--codorna-chart-aluguel)',
  				gasolina: 'var(--codorna-chart-gasolina)',
  				cartao: 'var(--codorna-chart-cartao)',
  				ifood: 'var(--codorna-chart-ifood)',
  				investimentos: 'var(--codorna-chart-investimentos)',
  				mercado: 'var(--codorna-chart-mercado)',
  				casa: 'var(--codorna-chart-casa)'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Helvetica Neue"',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI"',
  				'Roboto',
  				'Arial',
  				'sans-serif'
  			],
  			mono: 'var(--codorna-font-mono)'
  		},
  		spacing: {
  			'codorna-1': 'var(--codorna-space-1)',
  			'codorna-2': 'var(--codorna-space-2)',
  			'codorna-3': 'var(--codorna-space-3)',
  			'codorna-4': 'var(--codorna-space-4)',
  			'codorna-5': 'var(--codorna-space-5)',
  			'codorna-6': 'var(--codorna-space-6)',
  			'codorna-8': 'var(--codorna-space-8)',
  			'codorna-10': 'var(--codorna-space-10)',
  			'codorna-12': 'var(--codorna-space-12)',
  			'codorna-16': 'var(--codorna-space-16)',
  			'codorna-20': 'var(--codorna-space-20)'
  		},
  		boxShadow: {
  			'codorna-small': 'none',
  			'codorna-medium': 'none',
  			'codorna-large': 'none',
  			'codorna-card': 'none',
  			none: 'none',
  			sm: 'none',
  			DEFAULT: 'none',
  			md: 'none',
  			lg: 'none',
  			xl: 'none',
  			'2xl': 'none',
  			inner: 'none'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
