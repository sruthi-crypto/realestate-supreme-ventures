import { describe, expect, it } from 'vitest';
import { getTelegramBotUrl } from '../pages/Packages';

describe('Telegram navigation', () => {
    it('builds a proper telegram bot deep link with order id', () => {
        expect(getTelegramBotUrl('my_bot', 'ORD-20260830-0001')).toBe(
            'https://t.me/my_bot?start=ORD-20260830-0001'
        );
    });

    it('removes the @ symbol from bot usernames', () => {
        expect(getTelegramBotUrl('@my_bot')).toBe('https://t.me/my_bot');
    });
});
