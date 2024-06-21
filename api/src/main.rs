mod curve;
mod ecvrf;
pub mod error;
pub mod hash;

pub use curve::*;
pub use ecvrf::*;

pub type StarkVRF = ECVRF<StarkCurve, hash::PoseidonHash>;

use ark_ec::{short_weierstrass::SWCurveConfig, CurveGroup};
use ark_ff::BigInteger256;
use serde::Serialize;
use std::env;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use warp::Filter;

#[derive(Serialize)]
struct VrfResponse {
    public_key: String,
    seed: String,
    proof_gamma_x: String,
    proof_gamma_y: String,
    proof_c: String,
    proof_s: String,
    proof_verify_hint: String,
    beta: String,
}

fn vrf_filter(
    seed_counter: Arc<AtomicUsize>,
    secret_key: ScalarField,
) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
    warp::path!("api" / "vrf").map(move || {
        let public_key = (curve::StarkCurve::GENERATOR * secret_key).into_affine();

        let seed_value = seed_counter.fetch_add(1, Ordering::SeqCst) as u64;
        let seed_bigint = BigInteger256::from(seed_value);
        let seed = BaseField::new(seed_bigint);

        let ecvrf = StarkVRF::new(public_key).unwrap();
        let proof = ecvrf.prove(&secret_key, &[seed]).unwrap();
        let sqrt_ratio_hint = ecvrf.hash_to_sqrt_ratio_hint(&[seed]);
        let beta = ecvrf.proof_to_hash(&proof).unwrap();

        let response = VrfResponse {
            public_key: format!("{:?}", public_key),
            seed: seed_value.to_string(),
            proof_gamma_x: format!("{}", proof.0.x),
            proof_gamma_y: format!("{}", proof.0.y),
            proof_c: format!("{}", proof.1),
            proof_s: format!("{}", proof.2),
            proof_verify_hint: format!("{}", sqrt_ratio_hint),
            beta: format!("{}", beta),
        };

        warp::reply::json(&response)
    })
}

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    let secret_key_value = env::var("VITE_SECRET_KEY").expect("VITE_SECRET_KEY must be set");
    let secret_key = ScalarField::from(secret_key_value.parse::<u64>().unwrap());

    let seed_counter = Arc::new(AtomicUsize::new(42));

    let vrf = vrf_filter(seed_counter, secret_key);

    warp::serve(vrf).run(([0, 0, 0, 0], 3000)).await;
}
