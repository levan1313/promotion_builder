export const leaderboard_01 =  (id:string) => `

/* Leaderboard Container */
.leaderboard-container {
  width: 80%;
  max-width: 1273px;
  border-radius: 10px;
  overflow: hidden;
  color: white;
}

/* Header Section */
.glowing-border {
  padding: 1px;
  text-align: center;
  border-radius: 8px;
  background: linear-gradient(to bottom, #06273300 20%, #189540 100%);
  font-size: 1.5rem;
  font-weight: bold;
  width: 100%;
  max-width: 600px;
  margin: auto;
  margin-bottom: 20px;
}

.leaderboard-header {
  text-align: center;
  background: linear-gradient( to bottom, #06273300 40%, #1895412E 100%);
  /* background: url(./images/gradient.png); */
  /* background: linear-gradient(to top, rgba(24, 149, 65, 0.18), rgba(6, 39, 51, 0)); */
  padding: 28px 0;
  border-radius: 8px;
}

.leaderboard-header__title {
  font-size: 24px;
  font-weight: 700;
}

.leaderboard-header__title img {
  width: 40px;
  vertical-align: middle;
  margin-right: 15px;
}

/* Table */
.leaderboard-table {
  width: 98%;
  text-align: center;
  margin: auto;
  border-spacing: 0 12px; /* Adds spacing between rows */
}

.leaderboard-table__header-cell {
  padding: 20px 27px;
  font-size: 20px;
}

.leaderboard-table__row {
  border-radius: 8px;
}

.leaderboard-table__cell {
  padding: 15px;
  font-size: 20px;
}

.leaderboard-table__cell img {
  width: 55px;
  object-fit: cover;
}

/* Scrollable Table Wrapper */
.leaderboard-table-wrapper {
  max-height: 500px;
  overflow-y: auto;
  margin: 0 12px 32px;
}

/* Sticky Header */
thead {
  position: sticky;
  top: 0;
  z-index: 1;
}

/* row radius */

/* Rounded Corners for First/Last TD */
.leaderboard-table__row td:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.leaderboard-table__row td:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

/* Sticky Footer */
.sticky-footer {
  position: sticky;
  bottom: 0;
  font-weight: bold;
  text-align: center;
}

.sticky-footer td {
  padding: 15px;
}

/* Scrollbar Styles */
.leaderboard-table-wrapper::-webkit-scrollbar {
  width: 8px;
}

.leaderboard-table-wrapper::-webkit-scrollbar-thumb {
  background: #ffffff20;
  border-radius: 10px;
}

.leaderboard-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #189540;
}
`