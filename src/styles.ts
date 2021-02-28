export default `
.points,
.manual-check-warning {
  display: inline-block;
  margin-left: 14px;
  padding: 0 7px;
  border-radius: 2px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #389e0d;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  transform: translateY(-3px);
}

.points:empty {
  display: none;
}

.partial-points,
.manual-check-warning {
  background: #fffbe6;
  border-color: #ffe58f;
  color: #d48806;
}

.no-points {
  background: #fff1f0;
  border-color: #ffa39e;
  color: #cf1322;
}

.manual-check-warning {
  font-weight: 700;
}

.test .manual-check-warning {
  transform: none;
}

#mocha .test.pass.manual-check::before {
  content: '?';
  color: #d48806;
}

#mocha li.warnings {
  padding: 15px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  color: #d48806;
}

#mocha li.warnings h1 {
  margin: 0;
  font-weight: 700;
}

#mocha li.warnings pre {
  margin-bottom: 0;
  white-space: pre-wrap;
  font-size: 16px;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.9em;
  height: 1.5em;
  margin: 0 1.6em;
  display: inline-block;
  transform: translate(-50%, -50%);
  animation: throbber-loader 2000ms 300ms infinite ease-out;
  background: #dde2e7;
}

.loader:before,
.loader:after {
  content: '';
  position: absolute;
  width: 0.9em;
  height: 1.5em;
  top: 0;
  display: inline-block;
  background: #dde2e7;
}

.loader:before {
  left: -1.6em;
  animation: throbber-loader 2000ms 150ms infinite ease-out;
}

.loader:after {
  right: -1.6em;
  animation: throbber-loader 2000ms 450ms infinite ease-out;
}

@keyframes throbber-loader {
  0% {
    background: #dde2e7;
  }
  10% {
    background: #6b9dc8;
  }
  40% {
    background: #dde2e7;
  }
}
`;
