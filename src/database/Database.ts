/* eslint-disable @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
import SQLite3 from 'better-sqlite3';
import { Study } from '../interfaces';

export class Database {
    public readonly sql: SQLite3.Database;

    public constructor() {
        this.sql = new SQLite3('otetudai.db');

        const studyTable = this.sql.prepare('SELECT count(*) FROM sqlite_master WHERE type=\'table\' AND name = \'studys\';').get();
        if (!studyTable['count(*)']) {
            this.sql.prepare('CREATE TABLE studys (id TEXT PRIMARY KEY, userid TEXT, year INTEGER, month INTEGER, day INTEGER, time INTEGER);').run();
            this.sql.prepare('CREATE UNIQUE INDEX idx_studys_id ON studys (id);').run();
        }

        this.sql.pragma('synchronous = 1');
        this.sql.pragma('journal_mode = wal');
    }

    initializeStudy(userid: string, year: number, month: number, day: number): void {
        if (this.getStudy(userid, year, month, day)) return;
        this.sql.prepare('INSERT INTO studys VALUES (?, ?, ?, ?, ?, ?);').run(`${userid}-${year}-${month}-${day}`, userid, year, month, day, 0);
    }

    getStudy(userid: string, year: number, month: number, day: number): Study | undefined {
        return this.sql.prepare('SELECT * FROM studys WHERE userid = ? AND year = ? AND month = ? AND day = ?;').get(userid, year, month, day);
    }

    addStudyTime(userid: string, year: number, month: number, day: number, time: number): void {
        if (!this.getStudy(userid, year, month, day)) return;
        this.sql.prepare('UPDATE studys SET time = time + ? WHERE userid = ? AND year = ? AND month = ? AND day = ?;').run(time, userid, year, month, day);
    }

    removeStudyTime(userid: string, year: number, month: number, day: number, time: number): void {
        if (!this.getStudy(userid, year, month, day)) return;
        this.sql.prepare('UPDATE studys SET time = time - ? WHERE userid = ? AND year = ? AND month = ? AND day = ?;').run(time, userid, year, month, day);
    }

    updateStudyTime(userid: string, year: number, month: number, day: number, time: number): void {
        if (!this.getStudy(userid, year, month, day)) return;
        this.sql.prepare('UPDATE studys SET time = ? WHERE userid = ? AND year = ? AND month = ? AND day = ?;').run(time, userid, year, month, day);
    }

    deleteStudy(userid: string, year: number, month: number, day: number): void {
        if (!this.getStudy(userid, year, month, day)) return;
        this.sql.prepare('DELETE FROM studys WHERE userid = ? AND year = ? AND month = ? AND day = ?;').run(userid, year, month, day);
    }
}