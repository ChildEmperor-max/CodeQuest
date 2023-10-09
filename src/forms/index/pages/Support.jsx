import React from "react";

function Support() {
  return (
    <section className="section new" id="new">
      <div className="game-section">
        <h2 className="game-section-header section-header">
          Its Time to Play Something New
        </h2>
        <p className="section-details">there's always something new to play.</p>
        <div className="background">
          <div className="container">
            <div className="screen">
              <div className="screen-header">
                <div className="screen-header-left">
                  <div className="screen-header-button close"></div>
                  <div className="screen-header-button maximize"></div>
                  <div className="screen-header-button minimize"></div>
                </div>
                <div className="screen-header-right">
                  <div className="screen-header-ellipsis"></div>
                  <div className="screen-header-ellipsis"></div>
                  <div className="screen-header-ellipsis"></div>
                </div>
              </div>
              <div className="screen-body">
                <div className="screen-body-item left">
                  <div className="app-title">
                    <span>CONTACT</span>
                    <span>US</span>
                  </div>
                  <div className="app-contact">
                    CONTACT INFO : IT - 02
                    {/* +63 1234 567 8901 */}
                  </div>
                </div>
                <div className="screen-body-item">
                  <div className="app-form">
                    <div className="app-form-group">
                      <input className="app-form-control" placeholder="NAME" />
                    </div>
                    <div className="app-form-group">
                      <input className="app-form-control" placeholder="EMAIL" />
                    </div>
                    <div className="app-form-group">
                      <input
                        className="app-form-control"
                        placeholder="CONTACT"
                      />
                    </div>
                    <div className="app-form-group message">
                      <input
                        className="app-form-control"
                        placeholder="MESSAGE"
                      />
                    </div>
                    <div className="app-form-group buttons">
                      <button className="app-form-button">SEND</button>
                      <button className="app-form-button">CANCEL</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* background */}
      </div>
    </section>
  );
}

export default Support;
