import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/about-page.css';

function AboutPage(): React.ReactElement {
  return (
    <div className="about">
      <header className="about__header">
        <h1 className="about__title">About Tic-Tac-Toe</h1>
        <p className="about__subtitle">Two-player · pass and play</p>
      </header>

      <main className="about__main">
        <section className="about__section">
          <h2 className="about__section-title">What is Tic-Tac-Toe?</h2>
          <p className="about__text">
            Tic-Tac-Toe is a classic two-player strategy game played on a 3×3
            grid. Players take turns marking a cell with their symbol —{' '}
            <span className="about__marker about__marker--x">X</span> or{' '}
            <span className="about__marker about__marker--o">O</span> — with the
            goal of placing three of their markers in a row.
          </p>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">How to Play</h2>
          <ol className="about__list">
            <li className="about__list-item">
              Player <span className="about__marker about__marker--x">X</span>{' '}
              always goes first.
            </li>
            <li className="about__list-item">
              Players alternate turns, clicking an empty cell to place their
              marker.
            </li>
            <li className="about__list-item">
              The first player to place three markers in a horizontal, vertical,
              or diagonal row wins.
            </li>
            <li className="about__list-item">
              If all nine cells are filled and no player has three in a row, the
              game ends in a draw.
            </li>
            <li className="about__list-item">
              Press <strong>Reset</strong> at any time to start a new game.
            </li>
          </ol>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">Winning Combinations</h2>
          <p className="about__text">
            There are eight ways to win — three rows, three columns, and two
            diagonals:
          </p>
          <ul className="about__list">
            <li className="about__list-item">Rows: top, middle, bottom</li>
            <li className="about__list-item">Columns: left, centre, right</li>
            <li className="about__list-item">Diagonals: top-left to bottom-right, top-right to bottom-left</li>
          </ul>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">Credits</h2>
          <p className="about__text">
            Built with React and TypeScript. Designed as a demonstration of
            clean component architecture, accessible markup, and design-token–
            driven styling.
          </p>
        </section>

        <div className="about__nav">
          <Link to="/" className="about__back-link">
            ← Back to Game
          </Link>
        </div>
      </main>

      <footer className="about__footer">
        <p className="about__footer-text">Tic-Tac-Toe · Two-player pass and play</p>
      </footer>
    </div>
  );
}

export default AboutPage;
