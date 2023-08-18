import React, { useState, useEffect } from "react";
import ItemDetailsDescription from "./ItemDetailsDescription";
import ItemDetailsHistory from "./ItemDetailsHistory";
import ItemDetailsUser from "./ItemDetailsUser";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import OverlayImage from "./Overlay";

var Carousel = require("react-responsive-carousel").Carousel;
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

// Demo styles, see 'Styles' section below for some notes on use.
import "react-accessible-accordion/dist/fancy-example.css";

const ItemDetailsArea = ({ tokenID, data }) => {
  const [ipfsData, setipfsData] = useState();
  const [marketplaceModule, setMarketplaceModule] = useState();
  const [satelitleImg, setSateliteImg] = useState();
  const [worktopoImg, setWorldTopoImg] = useState();
  const sdk = new ThirdwebSDK("mumbai", {
    clientId: process.env.thirdweb_CLIENTID,
  });
  // console.log(tokenID);

 useEffect(() => {
   async function fetchMkData() {
     try {
       const marketplaceContract = await sdk.getContract(
         process.env.Marketplace_Contract
       );
       setMarketplaceModule(marketplaceContract);
     } catch (error) {
       console.error("Error fetching marketplace data:", error);
     }
   }
   fetchMkData();
 }, []);


  useEffect(() => {
    async function fetchIpfsData() {
      try {
        console.log(data?.asset.properties.IPFSHash);
        const response = await fetch(data?.asset.properties.IPFSHash);
        const ipfsData = await response.json();
        setipfsData(ipfsData.parcelData);
        console.log(ipfsData.parcelData);
        setSateliteImg(ipfsData.parcelData.image_urls.satellite_image);
        setWorldTopoImg(ipfsData.parcelData.image_urls.world_topo_image);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchIpfsData();
  }, [data]);
  // console.log(satelitleImg)

  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  const comingSoonTime = () => {
    const endTimeInSeconds = data?.endTimeInSeconds; // Set the endTimeInSeconds variable
    const now = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    const timeLeft = endTimeInSeconds - now;

    if (timeLeft > 0) {
      const countdays = Math.floor(timeLeft / 86400);
      const counthours = Math.floor((timeLeft % 86400) / 3600);
      const countminutes = Math.floor((timeLeft % 3600) / 60);
      const countseconds = Math.floor(timeLeft % 60);

      setDays(countdays);
      setHours(counthours);
      setMinutes(countminutes);
      setSeconds(countseconds);
    } else {
      // Bidding is over
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  };

  // console.log(data)
  useEffect(() => {
    const interval = setInterval(() => {
      comingSoonTime();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [data]);

  return (
    <>
      <div className="item-details-area pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="item-details-left-side pr-20">
                <div className="item-details-img">
                  {/* {satelitleImg && worktopoImg ? (
                    <>
                      <OverlayImage
                        image1={satelitleImg}
                        image2={worktopoImg}
                      />
                    </>
                  ) : (
                    ""
                  )} */}
                  <span>
                    <i className="ri-heart-line"></i> 340
                  </span>
                </div>

                <Carousel showArrows={true}>
                  <div>
                    <img src={data?.asset.image} alt="Images" />
                  </div>
                  <div>
                    <img src={satelitleImg} alt="Images" />
                  </div>

                  <div>
                    <img src={worktopoImg} alt="Images" />
                  </div>
                </Carousel>

                {data && (
                  <div className="item-details-left-side pr-20">
                    <div className="item-details-img"></div>
                    <div
                      style={{
                        backgroundColor: "whitesmoke",
                        borderRadius: "20px",
                      }}
                      className="px-3 py-5"
                    >
                      <div className="section-title px-2">
                        <div className="fs-5">Description</div>
                        <hr />
                        <p>{data?.asset.description}</p>
                      </div>
                    </div>
                    <div
                      className="mt-5 px-3 py-5"
                      style={{
                        backgroundColor: "whitesmoke",
                        borderRadius: "20px",
                      }}
                    >
                      <div className="d-flex justify-content-between px-2">
                        <div className="fs-5">Address</div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${data?.asset.lat},${data?.asset.lng}`}
                          target="_blank"
                          className="btn btn-success h4 "
                        >
                          Open in google maps
                        </a>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between mt-5 px-2">
                        <div>
                          <div>
                            Street
                            <b className="text-primary px-3">
                              : {ipfsData?.address?.street}
                            </b>
                          </div>
                          <div className="my-2">
                            City
                            <b className="text-primary px-3">
                              : {ipfsData?.address?.city}
                            </b>
                          </div>
                          <div>
                            Canton
                            <b className="text-primary px-3">
                              : {ipfsData ? ipfsData?.address?.canton : ""}
                            </b>
                          </div>
                        </div>
                        <div>
                          <div>
                            ZIP
                            <b
                              style={{ marginLeft: "65px" }}
                              className="text-primary"
                            >
                              : {ipfsData?.address?.zip}
                            </b>
                          </div>
                          <div className="my-2">
                            Latitude
                            <b
                              style={{ marginLeft: "30px" }}
                              className="text-primary "
                            >
                              : {data?.asset.lat}
                            </b>
                          </div>
                          <div>
                            Longitude
                            <b
                              style={{ marginLeft: "20px" }}
                              className="text-primary "
                            >
                              : {data?.asset.lng}
                            </b>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "whitesmoke",
                        borderRadius: "20px",
                      }}
                      className="px-3 py-5 mt-5"
                    >
                      <div className="section-title px-2">
                        <div className="fs-5">Building</div>
                        <hr />
                        <div className="d-flex justify-content-between mt-5 px-2">
                          <div>
                            <div>
                              Bldg Constr Year
                              <b className="text-primary px-3">
                                : {ipfsData?.building?.bldg_constr_year}
                              </b>
                            </div>
                            <div className="my-2">
                              Bldg Flats
                              <b className="text-primary px-3">
                                : {ipfsData?.building?.bldg_flats}
                              </b>
                            </div>
                            <div>
                              Bldg Floors
                              <b className="text-primary px-3">
                                : {ipfsData?.building?.bldg_floors}
                              </b>
                            </div>
                          </div>
                          <div>
                            <div>
                              Bldg Size
                              <b
                                style={{ marginLeft: "30px" }}
                                className="text-primary"
                              >
                                : {ipfsData?.building?.bldg_size}
                              </b>
                            </div>
                            <div className="my-2">
                              Bldg Vol
                              <b
                                style={{ marginLeft: "37px" }}
                                className="text-primary "
                              >
                                : {ipfsData?.building?.bldg_vol}
                              </b>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: "whitesmoke",
                        borderRadius: "20px",
                      }}
                      className="px-3 py-5 mt-5"
                    >
                      <div className="fs-5">Plot</div>
                      <hr />

                      <Accordion>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              Parcel Information
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div>
                              <div>
                                Parcel Area
                                <b className="text-primary px-3">
                                  : {ipfsData?.plot?.parcel_area}
                                </b>
                              </div>
                              <div className="my-2">
                                Ratio_S
                                <b className="text-primary px-3">
                                  : {ipfsData?.plot?.ratio_s}
                                </b>
                              </div>
                              <div>
                                Ratio S Free
                                <b className="text-primary px-3">
                                  : {ipfsData?.plot?.ratio_s_free}
                                </b>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>Area</AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between  px-2">
                              <div>
                                <div>
                                  Ratio V
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.plot?.ratio_v}
                                  </b>
                                </div>
                                <div className="my-2">
                                  Ratio V Free
                                  <b
                                    style={{ marginLeft: "37px" }}
                                    className="text-primary "
                                  >
                                    : {ipfsData?.plot?.ratio_v_free}
                                  </b>
                                </div>
                                <div>
                                  Ratio S Free
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.plot?.ratio_s_free}
                                  </b>
                                </div>
                              </div>
                              <div>
                                <div className="my-2">
                                  Area Max
                                  <b
                                    style={{ marginLeft: "37px" }}
                                    className="text-primary "
                                  >
                                    : {ipfsData?.plot?.area_max}
                                  </b>
                                </div>
                                <div>
                                  Vol Max
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.plot?.vol_max}
                                  </b>
                                </div>
                                <div>
                                  Ratio S
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.plot?.ratio_s}
                                  </b>
                                </div>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    <div
                      style={{
                        backgroundColor: "whitesmoke",
                        borderRadius: "20px",
                      }}
                      className="px-3 py-5 mt-5"
                    >
                      <div className="fs-5">Aditional Information</div>
                      <hr />

                      <Accordion>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              Construction Zone
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between">
                              <div>
                                <div>
                                  CZ abbreveiation
                                  <b className="text-primary px-3">
                                    : {ipfsData?.construction_zone?.cz_abbrev}
                                  </b>
                                </div>
                                <div className="my-2">
                                  CZ Floors Usual
                                  <b className="text-primary px-3">
                                    :{" "}
                                    {
                                      ipfsData?.construction_zone
                                        ?.cz_floors_usual
                                    }
                                  </b>
                                </div>
                                <div>
                                  CZ Height Usual
                                  <b className="text-primary px-3">
                                    :{" "}
                                    {
                                      ipfsData?.construction_zone
                                        ?.cz_height_usual
                                    }
                                  </b>
                                </div>
                              </div>
                              <div>
                                <div>
                                  CZ Local
                                  <b className="text-primary px-3">
                                    : {ipfsData?.construction_zone?.cz_local}
                                  </b>
                                </div>
                                <div className="my-2">
                                  CZ type
                                  <b className="text-primary px-3">
                                    : {ipfsData?.construction_zone?.cz_type}
                                  </b>
                                </div>
                                <div>
                                  CZ Util EST
                                  <b className="text-primary px-3">
                                    : {ipfsData?.construction_zone?.cz_util_est}
                                  </b>
                                </div>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>Noise</AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between  px-2">
                              <div>
                                <div>
                                  Noise Bahn Night
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.noise?.noise_bahn_night}
                                  </b>
                                </div>
                                <div className="my-2">
                                  Noise Bahn Day
                                  <b
                                    style={{ marginLeft: "37px" }}
                                    className="text-primary "
                                  >
                                    : {ipfsData?.noise?.noise_bahn_day}
                                  </b>
                                </div>
                              </div>
                              <div>
                                <div>
                                  Noise Street Night
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.noise?.noise_street_night}
                                  </b>
                                </div>
                                <div className="my-2">
                                  Noise Street Day
                                  <b
                                    style={{ marginLeft: "37px" }}
                                    className="text-primary "
                                  >
                                    : {ipfsData?.noise?.noise_street_day}
                                  </b>
                                </div>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>Travel</AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between  px-2">
                              <div>
                                <div>
                                  TT Agglo Pubt
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.travel?.tt_agglo_pubt}
                                  </b>
                                </div>
                              </div>
                              <div>
                                <div>
                                  TT Agglo Road
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.travel?.tt_agglo_road}
                                  </b>
                                </div>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>Vacancies</AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between  px-2">
                              <div>
                                <div>
                                  Vac All
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.vacancies?.vac_all}
                                  </b>
                                </div>
                              </div>
                              <div>
                                <div>
                                  Vac New
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.vacancies?.vac_new}
                                  </b>
                                </div>
                              </div>
                              <div>
                                <div>
                                  Vac Old
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.vacancies?.vac_old}
                                  </b>
                                </div>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>Tax</AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="d-flex justify-content-between  px-2">
                              <div>
                                <div>
                                  Tax 100k Pa
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.tax?.tax_100k_pa}
                                  </b>
                                </div>
                              </div>
                              <div>
                                <div>
                                  Tax Scale
                                  <b
                                    style={{ marginLeft: "30px" }}
                                    className="text-primary"
                                  >
                                    : {ipfsData?.tax?.tax_scale}
                                  </b>
                                </div>
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="item-details-dsce">
                <ItemDetailsDescription
                  days={days}
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  data={data}
                  ipfsData={ipfsData}
                />

                <ItemDetailsHistory data={data} />
                {/* <ItemDetailsUser /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetailsArea;
